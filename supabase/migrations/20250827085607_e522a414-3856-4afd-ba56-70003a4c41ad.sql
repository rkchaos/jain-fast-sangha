-- Drop all conflicting policies first
DROP POLICY IF EXISTS "Anyone can view public sanghas" ON public.sanghas;
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.memberships;
DROP POLICY IF EXISTS "Others can view memberships for public sanghas" ON public.memberships;
DROP POLICY IF EXISTS "Users can view sangha memberships they belong to" ON public.memberships;

-- Simple non-recursive policies for memberships
CREATE POLICY "View own memberships" ON public.memberships
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "View public sangha memberships" ON public.memberships
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.sanghas 
  WHERE sanghas.id = memberships.sangha_id 
  AND sanghas.privacy = 'public'
));

-- Simple policies for sanghas without circular reference
CREATE POLICY "View public sanghas" ON public.sanghas
FOR SELECT 
USING (privacy = 'public'::sangha_privacy);