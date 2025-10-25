import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Contact, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [contactsGranted, setContactsGranted] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const requestContactsPermission = async () => {
    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const props = ["name", "tel"];
        // @ts-ignore - Contacts API is experimental
        await navigator.contacts.select(props, { multiple: true });
        setContactsGranted(true);
        toast.success("Contact access granted!");
      } catch (error) {
        toast.info("You can add contacts manually later");
      }
    } else {
      toast.info("Contact access not available on this device");
    }
    setStep(2);
  };

  const skipContactsStep = () => {
    toast.info("You can grant access or add contacts later");
    setStep(2);
  };

  const createGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName,
          description: groupDescription,
          created_by: user.id,
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as first member
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: group.id,
          user_id: user.id,
          added_by: user.id,
        });

      if (memberError) throw memberError;

      toast.success("Group created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  const skipGroupCreation = () => {
    toast.info("You can create or join groups anytime");
    navigate("/");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md p-6 glass-card border-0">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>

        {step === 1 ? (
          // Step 1: Contacts Permission
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Contact className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">Access Contacts</h2>
              <p className="text-sm text-muted-foreground">
                Allow access to easily add friends to groups and split expenses
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={requestContactsPermission}
                className="w-full h-11 gradient-primary text-primary-foreground font-medium"
              >
                Allow Access
              </Button>

              <Button
                onClick={skipContactsStep}
                variant="ghost"
                className="w-full h-11"
              >
                Skip for Now
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              You can add contacts manually or grant permission later
            </p>
          </div>
        ) : (
          // Step 2: Create/Join Group
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-3xl bg-success/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-success" />
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Create a Group</h2>
              <p className="text-sm text-muted-foreground">
                Start tracking expenses with friends or family
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="Weekend Trip, Roommates, etc."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupDescription">
                  Description <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="groupDescription"
                  placeholder="What's this group for?"
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="h-11"
                />
              </div>

              <Button
                onClick={createGroup}
                disabled={loading}
                className="w-full h-11 gradient-primary text-primary-foreground font-medium"
              >
                {loading ? "Creating..." : "Create Group"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <Button
                onClick={skipGroupCreation}
                variant="ghost"
                className="w-full h-11"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Onboarding;
