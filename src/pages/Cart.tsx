import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Minus, Trash2, Home, Search, Package, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItemWithMedicine {
  id: string;
  medicine_id: string;
  quantity: number;
  medicine: {
    name: string;
    description: string;
    price: number;
  };
}

export default function Cart() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemWithMedicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadCart();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadCart = async () => {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        medicine_id,
        quantity,
        medicine:medicines (
          name,
          description,
          price
        )
      `);

    if (!error && data) {
      setCartItems(data as any);
    }
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, medicineId: string, newQty: number) => {
    if (newQty === 0) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId);
      
      if (!error) loadCart();
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", itemId);

      if (!error) loadCart();
    }
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);
    
    if (!error) {
      loadCart();
      toast({ description: "Item removed from cart" });
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal > 25 ? 0 : 3.99;
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const handleCheckout = () => {
    toast({ 
      title: "Checkout", 
      description: "Checkout functionality will be implemented soon!" 
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Cart ({cartItems.length})</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-4">
        {getDeliveryFee() === 0 && (
          <Card className="p-4 mb-4 bg-red-50 border-red-200">
            <div className="font-semibold text-red-900 mb-1">Fast Delivery Available</div>
            <div className="text-sm text-red-700">Free delivery on orders over $25</div>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🛒</div>
            <div className="text-xl font-semibold mb-2">Your cart is empty</div>
            <Button className="mt-4" onClick={() => navigate("/search")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.medicine.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      ${(item.medicine.price * item.quantity).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        ${item.medicine.price.toFixed(2)} each
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-full w-8 h-8 bg-primary/10"
                          onClick={() => updateQuantity(item.id, item.medicine_id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          className="rounded-full w-8 h-8 bg-primary"
                          onClick={() => updateQuantity(item.id, item.medicine_id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="p-4">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className={`font-medium ${getDeliveryFee() === 0 ? 'text-success' : ''}`}>
                    {getDeliveryFee() === 0 ? 'FREE' : `$${getDeliveryFee().toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">${getTotal().toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full h-12 text-base bg-primary"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-md mx-auto flex items-center justify-around py-3">
          <button onClick={() => navigate("/")} className="flex flex-col items-center gap-1 text-muted-foreground">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
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
