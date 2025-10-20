import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const BalanceSummary = () => {
  return (
    <Card className="p-4 sm:p-6 glass-card border-0 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Balance */}
        <div className="text-center md:text-left pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-border/30">
          <p className="text-xs text-muted-foreground mb-1">Your Balance</p>
          <p className="text-3xl sm:text-4xl font-bold mb-1">₹2,450</p>
          <p className="text-xs text-success flex items-center justify-center md:justify-start gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Overall, you are owed
          </p>
        </div>

        {/* You Owe */}
        <div className="relative">
          <div className="absolute inset-0 gradient-owed opacity-10 rounded-xl blur-xl" />
          <div className="relative bg-card rounded-xl p-4 border border-owed/20">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">You Owe</p>
              <div className="w-7 h-7 rounded-full bg-owed/10 flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5 text-owed" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-owed">₹1,250</p>
            <p className="text-xs text-muted-foreground mt-1">To 3 people</p>
          </div>
        </div>

        {/* You Are Owed */}
        <div className="relative">
          <div className="absolute inset-0 gradient-success opacity-10 rounded-xl blur-xl" />
          <div className="relative bg-card rounded-xl p-4 border border-success/20">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">You Are Owed</p>
              <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5 text-success" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-success">₹3,700</p>
            <p className="text-xs text-muted-foreground mt-1">From 5 people</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BalanceSummary;
