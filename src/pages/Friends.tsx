import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Users as UsersIcon, Search, Wallet, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Friends = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Load friends
      const { data: friendsData } = await supabase
        .from("friends")
        .select("*, profiles!friends_friend_id_fkey(id, full_name, phone)")
        .eq("user_id", session.user.id);

      setFriends(friendsData || []);

      // Load all users for search
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", session.user.id);

      setAllUsers(usersData || []);
    } catch (error: any) {
      toast.error("Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  const addFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from("friends")
        .insert({ user_id: user.id, friend_id: friendId });

      if (error) throw error;

      toast.success("Friend added successfully");
      loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add friend");
    }
  };

  const removeFriend = async (friendshipId: string) => {
    try {
      const { error } = await supabase
        .from("friends")
        .delete()
        .eq("id", friendshipId);

      if (error) throw error;

      toast.success("Friend removed");
      loadData();
    } catch (error: any) {
      toast.error("Failed to remove friend");
    }
  };

  const filteredUsers = allUsers.filter(
    (u) =>
      !friends.some((f) => f.friend_id === u.id) &&
      (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone?.includes(searchQuery))
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow animate-pulse">
            <UsersIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-secondary to-background overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-9 w-9"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Friends
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-0"
            />
          </div>

          {/* My Friends */}
          <Card className="p-4 glass-card border-0">
            <h2 className="text-base font-semibold mb-3">My Friends ({friends.length})</h2>
            {friends.length > 0 ? (
              <div className="space-y-2">
                {friends.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UsersIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {friendship.profiles?.full_name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {friendship.profiles?.phone || "No phone"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFriend(friendship.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UsersIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No friends yet</p>
                <p className="text-xs text-muted-foreground mt-1">Search below to add friends</p>
              </div>
            )}
          </Card>

          {/* Add Friends */}
          {searchQuery && (
            <Card className="p-4 glass-card border-0">
              <h2 className="text-base font-semibold mb-3">Search Results</h2>
              {filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UsersIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.full_name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{user.phone || "No phone"}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addFriend(user.id)}
                        className="gradient-primary text-primary-foreground"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Friends;
