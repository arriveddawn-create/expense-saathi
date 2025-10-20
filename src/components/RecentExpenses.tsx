import { Card } from "@/components/ui/card";
import { Coffee, ShoppingBag, Home, Utensils, Fuel } from "lucide-react";

const expenses = [
  {
    id: 1,
    title: "Dinner at The Spice Route",
    group: "Office Lunch",
    amount: 1200,
    paidBy: "You",
    split: 4,
    date: "Today",
    icon: Utensils,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: 2,
    title: "Grocery Shopping",
    group: "Roommates",
    amount: 850,
    paidBy: "Rahul",
    split: 3,
    date: "Yesterday",
    icon: ShoppingBag,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: 3,
    title: "Rent Payment",
    group: "Roommates",
    amount: 15000,
    paidBy: "You",
    split: 3,
    date: "2 days ago",
    icon: Home,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 4,
    title: "Coffee Shop",
    group: "Weekend Plans",
    amount: 450,
    paidBy: "Priya",
    split: 4,
    date: "3 days ago",
    icon: Coffee,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: 5,
    title: "Fuel",
    group: "Goa Trip 2024",
    amount: 2500,
    paidBy: "Arjun",
    split: 6,
    date: "5 days ago",
    icon: Fuel,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const RecentExpenses = () => {
  return (
    <Card className="p-4 sm:p-6 glass-card border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Recent Activity</h2>
        <button className="text-xs sm:text-sm text-primary active:opacity-70 transition-smooth">View All</button>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {expenses.map((expense) => {
          const Icon = expense.icon;
          const yourShare = expense.amount / expense.split;
          
          return (
            <div
              key={expense.id}
              className="group p-3 sm:p-4 rounded-xl bg-card border border-border active:scale-[0.98] transition-smooth cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${expense.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${expense.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5 group-active:text-primary transition-smooth truncate">
                    {expense.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {expense.group} · {expense.date}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-secondary text-foreground whitespace-nowrap">
                      {expense.paidBy} paid ₹{expense.amount}
                    </span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      Split {expense.split} ways
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-medium ${expense.paidBy === "You" ? 'text-success' : 'text-owed'}`}>
                    {expense.paidBy === "You" ? 'You lent' : 'You owe'}
                  </p>
                  <p className={`text-base sm:text-lg font-bold ${expense.paidBy === "You" ? 'text-success' : 'text-owed'}`}>
                    ₹{yourShare.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentExpenses;
