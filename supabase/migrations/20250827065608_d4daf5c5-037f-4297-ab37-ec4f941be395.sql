-- Fix RLS policy for sanghas - the memberships join was incorrect
DROP POLICY IF EXISTS "Members can view their sanghas" ON public.sanghas;

CREATE POLICY "Members can view their sanghas" 
ON public.sanghas 
FOR SELECT 
USING (EXISTS (
  SELECT 1 
  FROM memberships 
  WHERE memberships.sangha_id = sanghas.id 
  AND memberships.user_id = auth.uid()
));

-- Fix RLS policy for memberships - the self-join condition was always true
DROP POLICY IF EXISTS "Users can view memberships of their sanghas" ON public.memberships;

CREATE POLICY "Users can view memberships of their sanghas" 
ON public.memberships 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 
    FROM memberships m2 
    WHERE m2.sangha_id = memberships.sangha_id 
    AND m2.user_id = auth.uid()
  )
);

-- Add missing policies for news_comments
CREATE POLICY "Anyone can view news comments" 
ON public.news_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create news comments" 
ON public.news_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);