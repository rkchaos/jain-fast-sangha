-- Clear all user data from all tables
-- This will remove all existing users and their associated data

-- Clear user-generated content first (to avoid foreign key issues)
DELETE FROM blog_comments;
DELETE FROM blog_likes;
DELETE FROM blogs;
DELETE FROM news_comments;
DELETE FROM news_likes;
DELETE FROM chat_messages;
DELETE FROM rsvp;
DELETE FROM events;
DELETE FROM memberships;
DELETE FROM ad_clicks;
DELETE FROM calendar;
DELETE FROM notes;
DELETE FROM vrat_records;
DELETE FROM goals;
DELETE FROM notifications;
DELETE FROM profile_updates;

-- Clear sanghas (these may be referenced by other tables)
DELETE FROM sanghas;

-- Finally clear user profiles
DELETE FROM profiles;

-- Note: This does not clear auth.users as that's managed by Supabase Auth
-- Users will need to be manually deleted from the Auth Users panel if needed