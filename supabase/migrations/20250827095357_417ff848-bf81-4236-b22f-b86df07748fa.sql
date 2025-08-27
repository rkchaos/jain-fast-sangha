-- Enable real-time updates for tables
ALTER TABLE public.memberships REPLICA IDENTITY FULL;
ALTER TABLE public.vrat_records REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.memberships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vrat_records;