-- Create enums
CREATE TYPE public.sangha_privacy AS ENUM ('public', 'private');
CREATE TYPE public.membership_role AS ENUM ('member', 'admin');
CREATE TYPE public.vrat_type AS ENUM ('upvas', 'ekasna', 'ayambil', 'other');
CREATE TYPE public.vrat_status AS ENUM ('success', 'tried', 'fail');
CREATE TYPE public.goal_timeframe AS ENUM ('30d', '90d', '365d');
CREATE TYPE public.blog_category AS ENUM ('spiritual', 'community', 'teachings', 'personal');
CREATE TYPE public.news_category AS ENUM ('news', 'announcement', 'spiritual');
CREATE TYPE public.event_type AS ENUM ('fasting', 'talent_show', 'spiritual', 'community');
CREATE TYPE public.rsvp_status AS ENUM ('going', 'not_going', 'interested');
CREATE TYPE public.notification_type AS ENUM ('daily_prompt', 'festival_alert', 'tithi', 'community_update');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  otp_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email),
  UNIQUE(phone)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);

-- Sanghas table
CREATE TABLE public.sanghas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_sangha_id UUID REFERENCES public.sanghas(id),
  description TEXT,
  privacy sangha_privacy DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.sanghas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public sanghas are viewable by everyone" ON public.sanghas FOR SELECT USING (privacy = 'public');
CREATE POLICY "Authenticated users can create sanghas" ON public.sanghas FOR INSERT TO authenticated WITH CHECK (true);

-- Memberships table
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sangha_id UUID REFERENCES public.sanghas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role membership_role DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(sangha_id, user_id)
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view memberships" ON public.memberships FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join sanghas" ON public.memberships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave sanghas" ON public.memberships FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vrat Records table
CREATE TABLE public.vrat_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sangha_id UUID REFERENCES public.sanghas(id),
  date DATE NOT NULL,
  vrat_type vrat_type NOT NULL,
  note TEXT,
  status vrat_status DEFAULT 'success',
  is_retrospective BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.vrat_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own vrat records" ON public.vrat_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own vrat records" ON public.vrat_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vrat records" ON public.vrat_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vrat records" ON public.vrat_records FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Sangha members can view each others vrat records" ON public.vrat_records FOR SELECT TO authenticated USING (
  sangha_id IN (SELECT sangha_id FROM public.memberships WHERE user_id = auth.uid())
);

-- Goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_vrats INTEGER NOT NULL,
  timeframe goal_timeframe NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- Calendar table
CREATE TABLE public.calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  vrat_id UUID REFERENCES public.vrat_records(id) ON DELETE CASCADE
);

ALTER TABLE public.calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own calendar" ON public.calendar FOR ALL USING (auth.uid() = user_id);

-- Notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vrat_id UUID REFERENCES public.vrat_records(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- Ads table
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  redirect_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ads are viewable by everyone" ON public.ads FOR SELECT USING (true);

-- Ad Clicks table
CREATE TABLE public.ad_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own ad clicks" ON public.ad_clicks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Blogs table
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  youtube_url TEXT,
  category blog_category DEFAULT 'spiritual',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blogs are viewable by everyone" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Users can create blogs" ON public.blogs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own blogs" ON public.blogs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own blogs" ON public.blogs FOR DELETE USING (auth.uid() = user_id);

-- Blog Likes table
CREATE TABLE public.blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(blog_id, user_id)
);

ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog likes are viewable" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Users can like blogs" ON public.blog_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike blogs" ON public.blog_likes FOR DELETE USING (auth.uid() = user_id);

-- Blog Comments table
CREATE TABLE public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID REFERENCES public.blogs(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog comments are viewable" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.blog_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.blog_comments FOR DELETE USING (auth.uid() = user_id);

-- News table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category news_category DEFAULT 'news',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News is viewable by everyone" ON public.news FOR SELECT USING (true);

-- News Likes table
CREATE TABLE public.news_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES public.news(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(news_id, user_id)
);

ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News likes are viewable" ON public.news_likes FOR SELECT USING (true);
CREATE POLICY "Users can like news" ON public.news_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike news" ON public.news_likes FOR DELETE USING (auth.uid() = user_id);

-- News Comments table
CREATE TABLE public.news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID REFERENCES public.news(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News comments are viewable" ON public.news_comments FOR SELECT USING (true);
CREATE POLICY "Users can create news comments" ON public.news_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own news comments" ON public.news_comments FOR DELETE USING (auth.uid() = user_id);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sangha_id UUID REFERENCES public.sanghas(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type DEFAULT 'community',
  date_time TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by sangha members" ON public.events FOR SELECT TO authenticated USING (
  sangha_id IN (SELECT sangha_id FROM public.memberships WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- RSVPs table
CREATE TABLE public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status rsvp_status DEFAULT 'interested',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RSVPs are viewable" ON public.rsvps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own RSVPs" ON public.rsvps FOR ALL USING (auth.uid() = user_id);

-- Chat Messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sangha_id UUID REFERENCES public.sanghas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chat messages viewable by sangha members" ON public.chat_messages FOR SELECT TO authenticated USING (
  sangha_id IN (SELECT sangha_id FROM public.memberships WHERE user_id = auth.uid())
);
CREATE POLICY "Sangha members can send messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (
  sangha_id IN (SELECT sangha_id FROM public.memberships WHERE user_id = auth.uid()) AND auth.uid() = user_id
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  time TIME,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- Profile Updates audit table
CREATE TABLE public.profile_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  field_changed TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profile_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile updates" ON public.profile_updates FOR SELECT USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sanghas_updated_at BEFORE UPDATE ON public.sanghas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON public.rsvps FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();