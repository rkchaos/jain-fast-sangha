-- Create custom types/enums
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

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  otp_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create OTP table
CREATE TABLE public.otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL REFERENCES public.profiles(phone) ON DELETE CASCADE,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ads table
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  redirect_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ad clicks table
CREATE TABLE public.ad_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sanghas table
CREATE TABLE public.sanghas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_sangha_id UUID REFERENCES public.sanghas(id) ON DELETE SET NULL,
  description TEXT,
  privacy public.sangha_privacy DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create memberships table
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sangha_id UUID NOT NULL REFERENCES public.sanghas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.membership_role DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(sangha_id, user_id)
);

-- Create vrat_records table
CREATE TABLE public.vrat_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sangha_id UUID REFERENCES public.sanghas(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  vrat_type public.vrat_type NOT NULL,
  note TEXT,
  status public.vrat_status NOT NULL,
  is_retrospective BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_vrats INTEGER NOT NULL,
  timeframe public.goal_timeframe NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create calendar table
CREATE TABLE public.calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  vrat_id UUID NOT NULL REFERENCES public.vrat_records(id) ON DELETE CASCADE,
  UNIQUE(user_id, date, vrat_id)
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vrat_id UUID REFERENCES public.vrat_records(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blogs table
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  youtube_url TEXT,
  category public.blog_category DEFAULT 'community',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create blog_likes table
CREATE TABLE public.blog_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(blog_id, user_id)
);

-- Create blog_comments table
CREATE TABLE public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create news table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category public.news_category DEFAULT 'news',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create news_likes table
CREATE TABLE public.news_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(news_id, user_id)
);

-- Create news_comments table
CREATE TABLE public.news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sangha_id UUID NOT NULL REFERENCES public.sanghas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type public.event_type NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rsvp table
CREATE TABLE public.rsvp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.rsvp_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sangha_id UUID NOT NULL REFERENCES public.sanghas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  time TIME DEFAULT '09:00:00',
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profile_updates table
CREATE TABLE public.profile_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  field_changed TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sanghas_updated_at
  BEFORE UPDATE ON public.sanghas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rsvp_updated_at
  BEFORE UPDATE ON public.rsvp
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sanghas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vrat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for vrat_records
CREATE POLICY "Users can view their own vrat records" ON public.vrat_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vrat records" ON public.vrat_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vrat records" ON public.vrat_records
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for goals
CREATE POLICY "Users can manage their own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for calendar
CREATE POLICY "Users can manage their own calendar" ON public.calendar
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notes
CREATE POLICY "Users can manage their own notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for blogs
CREATE POLICY "Anyone can view published blogs" ON public.blogs
  FOR SELECT USING (true);

CREATE POLICY "Users can create blogs" ON public.blogs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blogs" ON public.blogs
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for blog_likes
CREATE POLICY "Users can manage their own blog likes" ON public.blog_likes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for blog_comments
CREATE POLICY "Anyone can view blog comments" ON public.blog_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create blog comments" ON public.blog_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for news
CREATE POLICY "Anyone can view news" ON public.news
  FOR SELECT USING (true);

-- RLS Policies for sanghas
CREATE POLICY "Anyone can view public sanghas" ON public.sanghas
  FOR SELECT USING (privacy = 'public');

CREATE POLICY "Members can view their sanghas" ON public.sanghas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships 
      WHERE sangha_id = id AND user_id = auth.uid()
    )
  );

-- RLS Policies for memberships
CREATE POLICY "Users can view memberships of their sanghas" ON public.memberships
  FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.memberships m2 
      WHERE m2.sangha_id = sangha_id AND m2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join sanghas" ON public.memberships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for events
CREATE POLICY "Members can view events in their sanghas" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships 
      WHERE sangha_id = events.sangha_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for RSVP
CREATE POLICY "Users can manage their own RSVP" ON public.rsvp
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
CREATE POLICY "Members can view messages in their sanghas" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships 
      WHERE sangha_id = chat_messages.sangha_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can send messages in their sanghas" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.memberships 
      WHERE sangha_id = chat_messages.sangha_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for ads (public read)
CREATE POLICY "Anyone can view ads" ON public.ads
  FOR SELECT USING (true);

-- RLS Policies for ad_clicks
CREATE POLICY "Users can create their own ad clicks" ON public.ad_clicks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for OTP (public access for verification)
CREATE POLICY "Anyone can manage OTP for verification" ON public.otp
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_profiles_phone ON public.profiles(phone);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_vrat_records_user_date ON public.vrat_records(user_id, date);
CREATE INDEX idx_vrat_records_sangha ON public.vrat_records(sangha_id);
CREATE INDEX idx_memberships_user_sangha ON public.memberships(user_id, sangha_id);
CREATE INDEX idx_events_sangha_date ON public.events(sangha_id, date_time);
CREATE INDEX idx_chat_messages_sangha_created ON public.chat_messages(sangha_id, created_at);
CREATE INDEX idx_blogs_category_created ON public.blogs(category, created_at);
CREATE INDEX idx_news_category_created ON public.news(category, created_at);