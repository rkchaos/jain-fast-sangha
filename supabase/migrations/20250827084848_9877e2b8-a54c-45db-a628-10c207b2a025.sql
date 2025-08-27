-- Fix RLS policies for profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create proper RLS policies for profiles
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE 
USING (auth.uid() = id);

-- Fix infinite recursion in memberships policies
DROP POLICY IF EXISTS "Users can view memberships of their sanghas" ON public.memberships;

-- Create simpler policy without recursion
CREATE POLICY "Users can view their own memberships" ON public.memberships
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view sangha memberships they belong to" ON public.memberships
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.memberships m2 
  WHERE m2.sangha_id = memberships.sangha_id 
  AND m2.user_id = auth.uid()
));

-- Ensure sanghas query works without recursion
DROP POLICY IF EXISTS "Members can view their sanghas" ON public.sanghas;

CREATE POLICY "Members can view their sanghas" ON public.sanghas
FOR SELECT 
USING (
  privacy = 'public'::sangha_privacy 
  OR 
  id IN (
    SELECT sangha_id FROM public.memberships 
    WHERE user_id = auth.uid()
  )
);