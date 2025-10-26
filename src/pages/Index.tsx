import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Receipt, TrendingUp, Wallet, User, LogOut, UserPlus } from "lucide-react";
import { toast } from "sonner";
import AddExpenseDialog from "@/components/AddExpenseDialog";
import AddFriendsToGroupDialog from "@/components/AddFriendsToGroupDialog";

const Index = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState("groups");
  const [user, setUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadData = async (userId: string) => {
    try {
      // Load groups
      const { data: groupsData } = await supabase
        .from("groups")
        .select("*, group_members(count)")
        .order("created_at", { ascending: false });

      setGroups(groupsData || []);

      // Load expenses
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("*, groups(name), profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(10);

      setExpenses(expensesData || []);
    } catch (error: any) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-3xl gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow animate-pulse">
            <Wallet className="w-8 h-8 text-primary-foreground" />
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
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SplitEasy
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 pb-6">
          {activeTab === "groups" && (
            <div>
              {groups.length > 0 ? (
                <Card className="p-4 glass-card border-0">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold">Your Groups</h2>
                    <Button
                      onClick={() => navigate("/onboarding")}
                      size="sm"
                      variant="ghost"
                      className="h-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {groups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{group.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {group.group_members?.[0]?.count || 0} members
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedGroup({ id: group.id, name: group.name });
                            setShowAddFriends(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Groups Yet</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Create a group to get started
                  </p>
                  <Button
                    onClick={() => navigate("/onboarding")}
                    className="gradient-primary text-primary-foreground"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              {expenses.length > 0 ? (
                <Card className="p-4 glass-card border-0">
                  <h2 className="text-base font-semibold mb-4">All Activity</h2>
                  <div className="space-y-3">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{expense.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {expense.groups?.name} • by {expense.profiles?.full_name || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-bold">₹{Number(expense.amount).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center glass-card border-0">
                  <Receipt className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No activity yet</p>
                </Card>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4">
              <Card className="p-6 text-center border-0 glass-card">
                <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center shadow-glow">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-1">{user?.user_metadata?.full_name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </Card>
              
              <Card className="p-4 border-0 glass-card space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3 px-4 rounded-xl hover:bg-destructive/10 transition-smooth text-sm font-medium text-destructive flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full gradient-primary shadow-glow flex items-center justify-center active:scale-95 transition-smooth"
        aria-label="Add Expense"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 backdrop-blur-xl bg-background/95 border-t border-border/50 safe-area-bottom">
        <div className="flex justify-around items-center px-2 py-2">
          <button
            onClick={() => setActiveTab("groups")}
            className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all active:scale-95 ${
              activeTab === "groups"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Groups</span>
          </button>

          <button
            onClick={() => navigate("/friends")}
            className="flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all active:scale-95 text-muted-foreground"
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-xs font-medium">Friends</span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all active:scale-95 ${
              activeTab === "activity"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span className="text-xs font-medium">Activity</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all active:scale-95 ${
              activeTab === "profile"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Add Expense Dialog */}
      <AddExpenseDialog open={showAddExpense} onOpenChange={setShowAddExpense} />
      
      {/* Add Friends to Group Dialog */}
      {selectedGroup && (
        <AddFriendsToGroupDialog
          open={showAddFriends}
          onOpenChange={setShowAddFriends}
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
        />
      )}
    </div>
  );
};

export default Index;
