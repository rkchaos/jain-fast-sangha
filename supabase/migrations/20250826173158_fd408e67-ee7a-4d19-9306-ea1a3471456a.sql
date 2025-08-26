-- Remove foreign key constraint from OTP table to profiles.phone
ALTER TABLE public.otp DROP CONSTRAINT otp_phone_fkey;

-- Change OTP table to use email instead of phone for verification
ALTER TABLE public.otp DROP COLUMN phone;
ALTER TABLE public.otp ADD COLUMN email TEXT NOT NULL;

-- Make email mandatory in profiles table
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;