-- Remove OTP table entirely as it's no longer needed
DROP TABLE IF EXISTS public.otp;

-- Update profiles table to make email mandatory
ALTER TABLE public.profiles ALTER COLUMN email SET NOT NULL;