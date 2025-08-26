// TypeScript interfaces for Jain Sangha platform database schema

export type SanghaPrivacy = 'public' | 'private';
export type MembershipRole = 'member' | 'admin';
export type VratType = 'upvas' | 'ekasna' | 'ayambil' | 'other';
export type VratStatus = 'success' | 'tried' | 'fail';
export type GoalTimeframe = '30d' | '90d' | '365d';
export type BlogCategory = 'spiritual' | 'community' | 'teachings' | 'personal';
export type NewsCategory = 'news' | 'announcement' | 'spiritual';
export type EventType = 'fasting' | 'talent_show' | 'spiritual' | 'community';
export type RsvpStatus = 'going' | 'not_going' | 'interested';
export type NotificationType = 'daily_prompt' | 'festival_alert' | 'tithi' | 'community_update';

export interface Profile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  otp_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface OTP {
  id: string;
  phone: string;
  otp_code: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface Ad {
  id: string;
  title: string;
  image_url?: string;
  redirect_url?: string;
  created_at: string;
}

export interface AdClick {
  id: string;
  user_id: string;
  ad_id: string;
  clicked_at: string;
}

export interface Sangha {
  id: string;
  name: string;
  parent_sangha_id?: string;
  description?: string;
  privacy: SanghaPrivacy;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  sangha_id: string;
  user_id: string;
  role: MembershipRole;
  joined_at: string;
}

export interface VratRecord {
  id: string;
  user_id: string;
  sangha_id?: string;
  date: string;
  vrat_type: VratType;
  note?: string;
  status: VratStatus;
  is_retrospective: boolean;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  target_vrats: number;
  timeframe: GoalTimeframe;
  created_at: string;
}

export interface Calendar {
  id: string;
  user_id: string;
  date: string;
  vrat_id: string;
}

export interface Note {
  id: string;
  user_id: string;
  vrat_id?: string;
  note: string;
  created_at: string;
}

export interface Blog {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url?: string;
  youtube_url?: string;
  category: BlogCategory;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BlogLike {
  id: string;
  blog_id: string;
  user_id: string;
  created_at: string;
}

export interface BlogComment {
  id: string;
  blog_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  author: string;
  category: NewsCategory;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface NewsLike {
  id: string;
  news_id: string;
  user_id: string;
  created_at: string;
}

export interface NewsComment {
  id: string;
  news_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Event {
  id: string;
  sangha_id: string;
  title: string;
  description?: string;
  event_type: EventType;
  date_time: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: RsvpStatus;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sangha_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  time: string;
  enabled: boolean;
  created_at: string;
}

export interface ProfileUpdate {
  id: string;
  user_id: string;
  field_changed: string;
  old_value?: any;
  new_value?: any;
  updated_at: string;
}

// API Request/Response types
export interface SignupRequest {
  name: string;
  phone: string;
  email?: string;
}

export interface OTPVerifyRequest {
  phone: string;
  otp_code: string;
}

export interface VratRecordRequest {
  date: string;
  vrat_type: VratType;
  note?: string;
  status: VratStatus;
  sangha_id?: string;
  is_retrospective?: boolean;
}

export interface AdClickRequest {
  ad_id: string;
}

export interface SanghaRequest {
  name: string;
  description?: string;
  privacy: SanghaPrivacy;
  parent_sangha_id?: string;
}

export interface GoalRequest {
  target_vrats: number;
  timeframe: GoalTimeframe;
}

export interface BlogRequest {
  title: string;
  content: string;
  image_url?: string;
  youtube_url?: string;
  category: BlogCategory;
  tags?: string[];
}

export interface NewsRequest {
  title: string;
  content: string;
  author: string;
  category: NewsCategory;
  tags?: string[];
}

export interface EventRequest {
  sangha_id: string;
  title: string;
  description?: string;
  event_type: EventType;
  date_time: string;
}

export interface RSVPRequest {
  event_id: string;
  status: RsvpStatus;
}

export interface ChatMessageRequest {
  sangha_id: string;
  message: string;
}

export interface CalendarQuery {
  timeframe: '30d' | '90d' | '365d';
  start_date?: string;
  end_date?: string;
}

// Extended types with relationships
export interface BlogWithDetails extends Blog {
  author: Profile;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  comments?: (BlogComment & { author: Profile })[];
}

export interface NewsWithDetails extends News {
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
  comments?: (NewsComment & { author: Profile })[];
}

export interface EventWithDetails extends Event {
  sangha: Sangha;
  creator: Profile;
  rsvp_count: {
    going: number;
    not_going: number;
    interested: number;
  };
  user_rsvp?: RsvpStatus;
}

export interface SanghaWithDetails extends Sangha {
  member_count: number;
  user_membership?: Membership;
  parent_sangha?: Sangha;
  sub_sanghas?: Sangha[];
}

export interface VratRecordWithDetails extends VratRecord {
  sangha?: Sangha;
}

export interface CalendarEntry {
  date: string;
  vrat_records: VratRecordWithDetails[];
}

export interface ProgressStats {
  total_vrats: number;
  success_rate: number;
  current_streak: number;
  longest_streak: number;
  by_type: Record<VratType, number>;
  by_month: Array<{
    month: string;
    count: number;
  }>;
}