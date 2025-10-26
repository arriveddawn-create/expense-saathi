-- Drop the existing SELECT policy for groups
DROP POLICY IF EXISTS "Users can view groups they are members of" ON groups;

-- Create new SELECT policy that allows viewing if user is creator OR member
CREATE POLICY "Users can view groups they created or are members of" 
ON groups 
FOR SELECT 
USING (
  auth.uid() = created_by 
  OR EXISTS (
    SELECT 1 FROM group_members 
    WHERE group_members.group_id = groups.id 
    AND group_members.user_id = auth.uid()
  )
);