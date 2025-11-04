import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShoppingCart, Zap, Plus, Home as HomeIcon, Search, Package, User } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  icon_color: string;
  item_count: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadCategories();
    loadCartCount();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .limit(6);

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const loadCartCount = async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select("quantity");

    if (!error && data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      Thermometer: "🌡️",
      Pill: "💊",
      Shield: "🛡️",
      Heart: "❤️",
      HeartPulse: "💗",
    };
    return icons[iconName] || "💊";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Deliver to</div>
            <button onClick={() => navigate("/cart")} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                  {cartCount}
                </Badge>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-medium">Main Street Sample City, Sample State 12345</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Health,<br/>Delivered Fast</h1>
          <p className="text-muted-foreground">
            Order medicines from trusted pharmacies and get them delivered to your doorstep in minutes.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 flex flex-col items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Emergency Delivery</div>
                <div className="text-xs text-muted-foreground">30 min delivery</div>
              </div>
            </Card>
            <Card className="p-6 flex flex-col items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold">Upload Prescription</div>
                <div className="text-xs text-muted-foreground">Get instant quote</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Browse Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Browse Categories</h2>
            <Button variant="link" className="text-primary p-0 h-auto">View All</Button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className="p-6 flex flex-col items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate("/search")}
                >
                  <div className={`w-12 h-12 rounded-full ${category.icon_color} flex items-center justify-center text-2xl`}>
                    {getIconComponent(category.icon)}
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-xs text-muted-foreground">{category.item_count}+ items</div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-md mx-auto flex items-center justify-around py-3">
          <button className="flex flex-col items-center gap-1 text-primary">
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button onClick={() => navigate("/search")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
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
