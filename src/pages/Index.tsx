import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Plus, Users, Receipt, TrendingUp, Wallet, Home, User } from "lucide-react";
import BalanceSummary from "@/components/BalanceSummary";
import GroupsList from "@/components/GroupsList";
import RecentExpenses from "@/components/RecentExpenses";
import AddExpenseDialog from "@/components/AddExpenseDialog";

const Index = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

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
          {activeTab === "home" && (
            <>
              {/* Balance Summary */}
              <div className="mb-4">
                <BalanceSummary />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Card className="p-3 glass-card border-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">Active Groups</p>
                  <p className="text-lg font-bold">4</p>
                </Card>

                <Card className="p-3 glass-card border-0">
                  <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                    <Receipt className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">Total</p>
                  <p className="text-lg font-bold">₹24.5k</p>
                </Card>

                <Card className="p-3 glass-card border-0">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mb-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">This Month</p>
                  <p className="text-lg font-bold">₹8.2k</p>
                </Card>
              </div>

              {/* Recent Expenses */}
              <RecentExpenses />
            </>
          )}

          {activeTab === "groups" && (
            <div>
              <GroupsList />
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">All Activity</h2>
              <RecentExpenses />
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4">
              <Card className="p-6 text-center border-0 glass-card">
                <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-3 flex items-center justify-center shadow-glow">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                <h2 className="text-xl font-bold mb-1">Your Name</h2>
                <p className="text-sm text-muted-foreground">+91 98765 43210</p>
              </Card>
              
              <Card className="p-4 border-0 glass-card space-y-2">
                <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-primary/5 transition-smooth text-sm font-medium">
                  Edit Profile
                </button>
                <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-primary/5 transition-smooth text-sm font-medium">
                  Settings
                </button>
                <button className="w-full text-left py-3 px-4 rounded-xl hover:bg-primary/5 transition-smooth text-sm font-medium">
                  Help & Support
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
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 py-2 px-5 rounded-xl transition-all active:scale-95 ${
              activeTab === "home"
                ? "text-primary bg-primary/10"
                : "text-muted-foreground"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </button>

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
    </div>
  );
};

export default Index;
