-- Add approved column to blogs
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;