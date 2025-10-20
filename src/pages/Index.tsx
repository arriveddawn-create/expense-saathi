import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users, Receipt, TrendingUp, Wallet } from "lucide-react";
import BalanceSummary from "@/components/BalanceSummary";
import GroupsList from "@/components/GroupsList";
import RecentExpenses from "@/components/RecentExpenses";
import AddExpenseDialog from "@/components/AddExpenseDialog";

const Index = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SplitEasy
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 space-y-4 sm:py-6 sm:space-y-6">
        {/* Balance Summary */}
        <BalanceSummary />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <Card className="p-4 glass-card border-0 active:scale-95 transition-smooth cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active Groups</p>
                <p className="text-xl font-bold">4</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-card border-0 active:scale-95 transition-smooth cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold">₹24,500</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 glass-card border-0 active:scale-95 transition-smooth cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">₹8,200</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Groups and Expenses */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <GroupsList />
          <RecentExpenses />
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-primary shadow-glow flex items-center justify-center active:scale-95 transition-smooth"
        aria-label="Add Expense"
      >
        <Plus className="w-6 h-6 text-primary-foreground" />
      </button>

      {/* Add Expense Dialog */}
      <AddExpenseDialog open={showAddExpense} onOpenChange={setShowAddExpense} />
    </div>
  );
};

export default Index;
