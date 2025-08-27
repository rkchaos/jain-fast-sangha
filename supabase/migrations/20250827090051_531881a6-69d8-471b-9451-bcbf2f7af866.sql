-- Drop ALL policies on both tables to start fresh
DROP POLICY IF EXISTS "View public sanghas" ON public.sanghas;
DROP POLICY IF EXISTS "View own memberships" ON public.memberships;
DROP POLICY IF EXISTS "View public sangha memberships" ON public.memberships;
DROP POLICY IF EXISTS "Members can view their sanghas" ON public.sanghas;
DROP POLICY IF EXISTS "Users can join sanghas" ON public.memberships;

-- Create a simple, non-recursive policy for sanghas
CREATE POLICY "Public sanghas are viewable by all" ON public.sanghas
FOR SELECT 
USING (privacy = 'public');

-- Create simple policies for memberships without circular references
CREATE POLICY "Users can view own memberships" ON public.memberships
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create memberships" ON public.memberships
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow sangha creation
CREATE POLICY "Users can create sanghas" ON public.sanghas
FOR INSERT 
WITH CHECK (true);