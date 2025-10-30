import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter, Plus, Minus, Home, Package, User, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  in_stock: boolean;
}

interface CartItem {
  medicine_id: string;
  quantity: number;
}

export default function SearchMedicines() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadMedicines();
    loadCart();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadMedicines = async () => {
    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .order("name");

    if (!error && data) {
      setMedicines(data);
    }
    setLoading(false);
  };

  const loadCart = async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("medicine_id, quantity");

    if (!error && data) {
      setCart(data);
    }
  };

  const getCartQuantity = (medicineId: string) => {
    return cart.find(item => item.medicine_id === medicineId)?.quantity || 0;
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => {
      const medicine = medicines.find(m => m.id === item.medicine_id);
      return sum + (medicine?.price || 0) * item.quantity;
    }, 0);
  };

  const addToCart = async (medicineId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const currentQty = getCartQuantity(medicineId);
    
    const { error } = await supabase
      .from("cart_items")
      .upsert({
        user_id: session.user.id,
        medicine_id: medicineId,
        quantity: currentQty + 1
      });

    if (!error) {
      loadCart();
      toast({ description: "Added to cart" });
    }
  };

  const removeFromCart = async (medicineId: string) => {
    const currentQty = getCartQuantity(medicineId);
    
    if (currentQty === 1) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("medicine_id", medicineId);
      
      if (!error) loadCart();
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: currentQty - 1 })
        .eq("medicine_id", medicineId)
        .eq("user_id", session.user.id);

      if (!error) loadCart();
    }
  };

  const filteredMedicines = medicines.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold mb-4">Search Medicines</h1>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button size="icon" className="bg-primary">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Medicine List */}
      <div className="max-w-md mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4">
            {filteredMedicines.map((medicine) => {
              const qty = getCartQuantity(medicine.id);
              return (
                <Card key={medicine.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{medicine.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm">{medicine.rating}</span>
                      </div>
                      <span className="text-xs text-success">In Stock</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-lg font-bold text-primary">${medicine.price}</span>
                      {qty === 0 ? (
                        <Button
                          size="icon"
                          className="bg-primary rounded-full"
                          onClick={() => addToCart(medicine.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="rounded-full w-8 h-8 bg-primary/10"
                            onClick={() => removeFromCart(medicine.id)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-6 text-center font-medium">{qty}</span>
                          <Button
                            size="icon"
                            className="rounded-full w-8 h-8 bg-primary"
                            onClick={() => addToCart(medicine.id)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4">
          <div className="max-w-md mx-auto">
            <Button
              className="w-full bg-primary h-14 text-base rounded-2xl shadow-lg"
              onClick={() => navigate("/cart")}
            >
              <div className="flex items-center justify-between w-full">
                <span>{getTotalItems()} Items in cart</span>
                <div className="flex items-center gap-2">
                  <span>View Cart</span>
                  <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-md mx-auto flex items-center justify-around py-3">
          <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary">
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">Search</span>
          </button>
          <button onClick={() => navigate("/orders")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Package className="w-6 h-6" />
            <span className="text-xs">Orders</span>
          </button>
          <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
