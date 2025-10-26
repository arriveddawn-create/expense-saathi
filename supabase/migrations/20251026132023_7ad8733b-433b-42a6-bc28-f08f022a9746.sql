-- Fix infinite recursion in group_members RLS by creating security definer function
CREATE OR REPLACE FUNCTION public.is_group_member(_user_id uuid, _group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE user_id = _user_id
      AND group_id = _group_id
  )
$$;

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Users can view members of their groups" ON public.group_members;

-- Create new policy using security definer function
CREATE POLICY "Users can view members of their groups"
ON public.group_members
FOR SELECT
USING (public.is_group_member(auth.uid(), group_id));

-- Create friends table
CREATE TABLE IF NOT EXISTS public.friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Enable RLS on friends table
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- RLS policies for friends table
CREATE POLICY "Users can view their own friendships"
ON public.friends
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can add friends"
ON public.friends
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove friends"
ON public.friends
FOR DELETE
USING (auth.uid() = user_id);