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
    <Card className="p-6 glass-card border-0 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Your Groups</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Group
        </Button>
      </div>

      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group relative p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-smooth cursor-pointer overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${group.color} opacity-0 group-hover:opacity-5 transition-smooth`} />
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center shadow-md`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-smooth">
                    {group.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {group.members} members
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  {group.balance !== 0 ? (
                    <>
                      <p className={`text-sm font-medium ${group.isOwed ? 'text-success' : 'text-owed'}`}>
                        {group.isOwed ? 'You get' : 'You owe'}
                      </p>
                      <p className={`text-lg font-bold ${group.isOwed ? 'text-success' : 'text-owed'}`}>
                        ₹{Math.abs(group.balance)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Settled up</p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-smooth" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GroupsList;
