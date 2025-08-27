-- Add approval status to blogs table
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT false;

-- Update existing blogs to be approved by default (grandfather existing content)
UPDATE public.blogs SET approved = true WHERE approved IS NULL;