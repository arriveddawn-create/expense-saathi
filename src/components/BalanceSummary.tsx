import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const BalanceSummary = () => {
  return (
    <Card className="p-8 glass-card border-0 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Balance */}
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground mb-2">Your Balance</p>
          <p className="text-4xl font-bold mb-1">₹2,450</p>
          <p className="text-sm text-success flex items-center justify-center md:justify-start gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Overall, you are owed
          </p>
        </div>

        {/* You Owe */}
        <div className="relative">
          <div className="absolute inset-0 gradient-owed opacity-10 rounded-2xl blur-xl" />
          <div className="relative bg-card rounded-2xl p-6 border border-owed/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">You Owe</p>
              <div className="w-8 h-8 rounded-full bg-owed/10 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-owed" />
              </div>
            </div>
            <p className="text-3xl font-bold text-owed">₹1,250</p>
            <p className="text-xs text-muted-foreground mt-1">To 3 people</p>
          </div>
        </div>

        {/* You Are Owed */}
        <div className="relative">
          <div className="absolute inset-0 gradient-success opacity-10 rounded-2xl blur-xl" />
          <div className="relative bg-card rounded-2xl p-6 border border-success/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">You Are Owed</p>
              <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                <ArrowDownRight className="w-4 h-4 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-success">₹3,700</p>
            <p className="text-xs text-muted-foreground mt-1">From 5 people</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BalanceSummary;
