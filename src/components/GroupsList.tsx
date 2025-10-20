import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, ChevronRight } from "lucide-react";

const groups = [
  {
    id: 1,
    name: "Goa Trip 2024",
    members: 6,
    balance: 1200,
    isOwed: true,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    name: "Roommates",
    members: 3,
    balance: -850,
    isOwed: false,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Office Lunch",
    members: 8,
    balance: 450,
    isOwed: true,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    name: "Weekend Plans",
    members: 4,
    balance: 0,
    isOwed: true,
    color: "from-orange-500 to-red-500",
  },
];

const GroupsList = () => {
  return (
    <Card className="p-4 sm:p-6 glass-card border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">Your Groups</h2>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-3">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">New Group</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group relative p-3 sm:p-4 rounded-xl bg-card border border-border active:scale-[0.98] transition-smooth cursor-pointer overflow-hidden min-h-[72px]"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-0 group-active:opacity-5 transition-smooth`} />
            
            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base mb-0.5 group-active:text-primary transition-smooth truncate">
                    {group.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {group.members} members
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <div className="text-right">
                  {group.balance !== 0 ? (
                    <>
                      <p className={`text-xs font-medium ${group.isOwed ? 'text-success' : 'text-owed'}`}>
                        {group.isOwed ? 'You get' : 'You owe'}
                      </p>
                      <p className={`text-base sm:text-lg font-bold ${group.isOwed ? 'text-success' : 'text-owed'}`}>
                        ₹{Math.abs(group.balance)}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">Settled</p>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-active:text-primary transition-smooth hidden sm:block" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GroupsList;
