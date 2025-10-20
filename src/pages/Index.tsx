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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SplitEasy
              </h1>
            </div>
            <Button 
              onClick={() => setShowAddExpense(true)}
              className="gradient-primary shadow-glow hover:scale-105 transition-smooth"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Balance Summary */}
        <BalanceSummary />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 glass-card border-0 hover:scale-105 transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Groups</p>
                <p className="text-2xl font-bold">4</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card border-0 hover:scale-105 transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">₹24,500</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-card border-0 hover:scale-105 transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₹8,200</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Groups and Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GroupsList />
          <RecentExpenses />
        </div>
      </main>

      {/* Add Expense Dialog */}
      <AddExpenseDialog open={showAddExpense} onOpenChange={setShowAddExpense} />
    </div>
  );
};

export default Index;
