-- Create profiles table if not exists (for user data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  icon_color TEXT NOT NULL,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  requires_prescription BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, medicine_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  pharmacy_name TEXT,
  estimated_delivery TEXT,
  address_id UUID REFERENCES public.addresses(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  medicine_id UUID REFERENCES public.medicines(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for addresses
CREATE POLICY "Users can view their own addresses" ON public.addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON public.addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- RLS Policies for medicines (public read)
CREATE POLICY "Anyone can view medicines" ON public.medicines FOR SELECT USING (true);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to their own cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Insert sample categories
INSERT INTO public.categories (name, icon, icon_color) VALUES
  ('Cold & Flu', 'Thermometer', 'bg-cyan-100 text-cyan-600'),
  ('Digestive', 'Pill', 'bg-yellow-100 text-yellow-600'),
  ('First Aid', 'Shield', 'bg-green-100 text-green-600'),
  ('Heart & BP', 'Heart', 'bg-red-100 text-red-600'),
  ('Heart Health', 'HeartPulse', 'bg-blue-100 text-blue-600'),
  ('Pain Relief', 'Pill', 'bg-orange-100 text-orange-600');

-- Insert sample medicines
INSERT INTO public.medicines (name, category_id, description, price, rating, in_stock) VALUES
  ('Acetaminophen 500mg', (SELECT id FROM public.categories WHERE name = 'Pain Relief' LIMIT 1), 'Pain Relief', 6.99, 4.3, true),
  ('Antacid Tablets', (SELECT id FROM public.categories WHERE name = 'Digestive' LIMIT 1), 'Vitamins', 6.99, 4.3, true),
  ('Aspirin 325mg', (SELECT id FROM public.categories WHERE name = 'Pain Relief' LIMIT 1), 'Pain Relief', 4.25, 4.2, true),
  ('Atenolol 25mg', (SELECT id FROM public.categories WHERE name = 'Heart & BP' LIMIT 1), 'Heart & BP', 11.75, 4.4, true),
  ('Paracetamol 500mg', (SELECT id FROM public.categories WHERE name = 'Pain Relief' LIMIT 1), 'Pain Relief', 5.99, 4.3, true),
  ('Ibuprofen 200mg', (SELECT id FROM public.categories WHERE name = 'Pain Relief' LIMIT 1), 'Pain Relief', 7.50, 4.5, true),
  ('Vitamin D3', (SELECT id FROM public.categories WHERE name = 'Digestive' LIMIT 1), 'Vitamins', 8.99, 4.6, true),
  ('Lisinopril 10mg', (SELECT id FROM public.categories WHERE name = 'Heart & BP' LIMIT 1), 'Heart & BP', 12.99, 4.4, true),
  ('Robitussin Cough Syrup', (SELECT id FROM public.categories WHERE name = 'Cold & Flu' LIMIT 1), 'Cough & Cold', 8.99, 4.2, true);