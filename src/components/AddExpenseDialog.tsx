import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coffee, ShoppingBag, Home, Utensils, Fuel, Film, Car, Heart } from "lucide-react";
import { toast } from "sonner";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: "food", label: "Food & Dining", icon: Utensils, color: "text-orange-500" },
  { value: "groceries", label: "Groceries", icon: ShoppingBag, color: "text-green-500" },
  { value: "rent", label: "Rent & Utilities", icon: Home, color: "text-blue-500" },
  { value: "transport", label: "Transport", icon: Car, color: "text-purple-500" },
  { value: "entertainment", label: "Entertainment", icon: Film, color: "text-pink-500" },
  { value: "fuel", label: "Fuel", icon: Fuel, color: "text-amber-500" },
  { value: "coffee", label: "Coffee & Drinks", icon: Coffee, color: "text-amber-600" },
  { value: "other", label: "Other", icon: Heart, color: "text-red-500" },
];

const groups = [
  { value: "goa", label: "Goa Trip 2024" },
  { value: "roommates", label: "Roommates" },
  { value: "office", label: "Office Lunch" },
  { value: "weekend", label: "Weekend Plans" },
];

const AddExpenseDialog = ({ open, onOpenChange }: AddExpenseDialogProps) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !selectedGroup || !selectedCategory) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Expense added successfully!", {
      description: `₹${amount} added to ${groups.find(g => g.value === selectedGroup)?.label}`,
    });

    // Reset form
    setDescription("");
    setAmount("");
    setSelectedCategory("");
    setSelectedGroup("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Add New Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Input
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-base sm:text-lg h-11 sm:h-12"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-xl sm:text-2xl font-bold h-14 sm:h-16"
            />
          </div>

          {/* Group Selection */}
          <div className="space-y-2">
            <Label>Select Group</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm">Category</Label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-smooth active:scale-95 min-h-[68px] sm:min-h-[76px] ${
                      selectedCategory === category.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto ${category.color}`} />
                    <p className="text-xs mt-1.5 sm:mt-2 text-center truncate">{category.label.split(' ')[0]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full gradient-primary shadow-glow text-base sm:text-lg py-5 sm:py-6 h-12 sm:h-14">
            Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;
