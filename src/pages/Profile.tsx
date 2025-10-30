import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Home, Search, Package, User as UserIcon, 
  UserCircle, MapPin, CreditCard, Bell, Shield, 
  Settings, HelpCircle, ChevronRight, LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadProfile();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data);
    } else {
      // Create profile if it doesn't exist
      setProfile({
        full_name: "Sarah Johnson",
        email: session.user.email,
        is_premium: true
      });
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const MenuItem = ({ icon: Icon, title, onClick }: any) => (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-4 hover:bg-accent transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium">{title}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground" />
    </button>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {profile?.full_name?.[0] || "S"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{profile?.full_name || "Sarah Johnson"}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email || "sarah.johnson@email.com"}</p>
                {profile?.is_premium && (
                  <span className="text-xs text-primary font-medium">Premium Member</span>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Account Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-4">Account</h3>
          <Card className="overflow-hidden">
            <MenuItem 
              icon={UserCircle} 
              title="Personal Information" 
              onClick={() => toast({ description: "Feature coming soon!" })}
            />
            <div className="border-t" />
            <MenuItem 
              icon={MapPin} 
              title="Addresses" 
              onClick={() => toast({ description: "Feature coming soon!" })}
            />
            <div className="border-t" />
            <MenuItem 
              icon={CreditCard} 
              title="Payment Methods" 
              onClick={() => toast({ description: "Feature coming soon!" })}
            />
          </Card>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-4">Preferences</h3>
          <Card className="overflow-hidden">
            <MenuItem 
              icon={Bell} 
              title="Notifications" 
              onClick={() => toast({ description: "Feature coming soon!" })}
            />
            <div className="border-t" />
            <MenuItem 
              icon={Shield} 
              title="Privacy & Security" 
              onClick={() => toast({ description: "Feature coming soon!" })}
            />
            <div className="border-t" />
            <MenuItem 
              icon={Settings} 
              title="App Settings" 
              onClick={() => toast({ description: "Feature coming soon!" })}
            />
          </Card>
        </div>

        {/* Support Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-4">Support</h3>
          <Card className="overflow-hidden">
            <MenuItem 
              icon={HelpCircle} 
              title="Help Center" 
              onClick={() => toast({ description: "Feature coming soon!" })}
            />
          </Card>
        </div>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full h-12 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
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
          <button className="flex flex-col items-center gap-1 text-primary">
            <UserIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
