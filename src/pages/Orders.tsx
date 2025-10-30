import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Home, Search, Package, User, MapPin } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  pharmacy_name: string;
  estimated_delivery: string;
  created_at: string;
  order_items: Array<{
    medicine: { name: string };
    quantity: number;
    price: number;
  }>;
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadOrders();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          quantity,
          price,
          medicine:medicines (name)
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "text-success";
      case "in_transit": return "text-info";
      case "processing": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return "✓";
      case "in_transit": return "🚚";
      case "processing": return "⏱";
      default: return "📦";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered": return "Delivered";
      case "in_transit": return "In Transit";
      case "processing": return "Processing";
      default: return status;
    }
  };

  const filterOrders = (status?: string) => {
    if (!status) return orders;
    if (status === "active") return orders.filter(o => o.status !== "delivered");
    if (status === "completed") return orders.filter(o => o.status === "delivered");
    return orders;
  };

  const renderOrders = (filteredOrders: Order[]) => {
    if (loading) {
      return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
    }

    if (filteredOrders.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📦</div>
          <div className="text-xl font-semibold mb-2">No orders yet</div>
          <Button className="mt-4" onClick={() => navigate("/search")}>
            Start Shopping
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold">{order.order_number}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                <span>{getStatusIcon(order.status)}</span>
                <span className="font-medium">{getStatusText(order.status)}</span>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              {order.order_items?.map((item, idx) => (
                <div key={idx} className="text-sm flex items-center justify-between">
                  <span>{item.quantity}x {item.medicine.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3 pb-3 border-b">
              <MapPin className="w-4 h-4" />
              <div>
                <div className="font-medium text-foreground">{order.pharmacy_name || "CVS Pharmacy"}</div>
                <div>Est. delivery: {order.estimated_delivery || "15 min"}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-primary">${order.total_amount.toFixed(2)}</span>
              {order.status === "in_transit" && (
                <Button size="sm" className="bg-primary">Track</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {renderOrders(filterOrders())}
          </TabsContent>
          <TabsContent value="active">
            {renderOrders(filterOrders("active"))}
          </TabsContent>
          <TabsContent value="completed">
            {renderOrders(filterOrders("completed"))}
          </TabsContent>
        </Tabs>
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
          <button className="flex flex-col items-center gap-1 text-primary">
            <Package className="w-6 h-6" />
            <span className="text-xs font-medium">Orders</span>
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
