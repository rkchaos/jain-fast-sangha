-- Fix infinite recursion in memberships policies by simplifying them
DROP POLICY IF EXISTS "Users can view their own memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can view sangha memberships they belong to" ON public.memberships;

-- Simple policies without recursion
CREATE POLICY "Users can view their own memberships" ON public.memberships
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Others can view memberships for public sanghas" ON public.memberships
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.sanghas 
  WHERE sanghas.id = memberships.sangha_id 
  AND sanghas.privacy = 'public'
));

-- Fix sanghas policy to not reference memberships
DROP POLICY IF EXISTS "Members can view their sanghas" ON public.sanghas;

CREATE POLICY "Anyone can view public sanghas" ON public.sanghas
FOR SELECT 
USING (privacy = 'public'::sangha_privacy);

CREATE POLICY "Members can view private sanghas they belong to" ON public.sanghas
FOR SELECT 
USING (
  privacy = 'private'::sangha_privacy 
  AND EXISTS (
    SELECT 1 FROM public.memberships 
    WHERE sangha_id = sanghas.id 
    AND user_id = auth.uid()
  )
);