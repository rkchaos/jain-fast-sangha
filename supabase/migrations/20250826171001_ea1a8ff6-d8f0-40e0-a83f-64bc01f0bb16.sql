-- Fix function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add missing RLS policies

-- RLS Policies for profile_updates (users can view their own update history)
CREATE POLICY "Users can view their own profile updates" ON public.profile_updates
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for news_likes (users can view likes and manage their own)
CREATE POLICY "Anyone can view news likes" ON public.news_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own news likes" ON public.news_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own news likes" ON public.news_likes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for news_comments (users can manage their own comments)
CREATE POLICY "Users can update their own news comments" ON public.news_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own news comments" ON public.news_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Add missing policies for blog_likes delete
CREATE POLICY "Users can delete their own blog likes" ON public.blog_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Add missing policies for blog_comments update/delete
CREATE POLICY "Users can update their own blog comments" ON public.blog_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blog comments" ON public.blog_comments
  FOR DELETE USING (auth.uid() = user_id);