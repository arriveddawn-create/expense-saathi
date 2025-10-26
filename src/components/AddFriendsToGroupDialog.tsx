import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface AddFriendsToGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
}

const AddFriendsToGroupDialog = ({
  open,
  onOpenChange,
  groupId,
  groupName,
}: AddFriendsToGroupDialogProps) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadFriends();
    }
  }, [open, groupId]);

  const loadFriends = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get friends
      const { data: friendsData } = await supabase
        .from("friends")
        .select("*, profiles!friends_friend_id_fkey(id, full_name, phone)")
        .eq("user_id", session.user.id);

      // Get existing group members
      const { data: membersData } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId);

      const existingMemberIds = membersData?.map((m) => m.user_id) || [];

      // Filter out friends who are already members
      const availableFriends = friendsData?.filter(
        (f) => !existingMemberIds.includes(f.friend_id)
      ) || [];

      setFriends(availableFriends);
    } catch (error: any) {
      toast.error("Failed to load friends");
    }
  };

  const handleAddFriends = async () => {
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const members = selectedFriends.map((friendId) => ({
        group_id: groupId,
        user_id: friendId,
        added_by: session.user.id,
      }));

      const { error } = await supabase.from("group_members").insert(members);

      if (error) throw error;

      toast.success(`Added ${selectedFriends.length} friend(s) to ${groupName}`);
      setSelectedFriends([]);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to add friends");
    } finally {
      setLoading(false);
    }
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Friends to {groupName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {friends.length > 0 ? (
            <>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {friends.map((friendship) => (
                  <div
                    key={friendship.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 cursor-pointer"
                    onClick={() => toggleFriend(friendship.friend_id)}
                  >
                    <Checkbox
                      checked={selectedFriends.includes(friendship.friend_id)}
                      onCheckedChange={() => toggleFriend(friendship.friend_id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {friendship.profiles?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {friendship.profiles?.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleAddFriends}
                disabled={loading || selectedFriends.length === 0}
                className="w-full gradient-primary text-primary-foreground"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add {selectedFriends.length > 0 ? `${selectedFriends.length} ` : ""}Friend
                {selectedFriends.length !== 1 ? "s" : ""}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No available friends to add
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All your friends are already in this group
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendsToGroupDialog;
