export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_clicks: {
        Row: {
          ad_id: string
          clicked_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          ad_id: string
          clicked_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          ad_id?: string
          clicked_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_clicks_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          redirect_url: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          redirect_url?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          redirect_url?: string | null
          title?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          blog_id: string
          content: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          category: Database["public"]["Enums"]["blog_category"] | null
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
          youtube_url: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["blog_category"] | null
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
          youtube_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["blog_category"] | null
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      calendar: {
        Row: {
          date: string
          id: string
          user_id: string
          vrat_id: string | null
        }
        Insert: {
          date: string
          id?: string
          user_id: string
          vrat_id?: string | null
        }
        Update: {
          date?: string
          id?: string
          user_id?: string
          vrat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_vrat_id_fkey"
            columns: ["vrat_id"]
            isOneToOne: false
            referencedRelation: "vrat_records"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          sangha_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          sangha_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          sangha_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_sangha_id_fkey"
            columns: ["sangha_id"]
            isOneToOne: false
            referencedRelation: "sanghas"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          created_by: string
          date_time: string
          description: string | null
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: string
          sangha_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          date_time: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          sangha_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          date_time?: string
          description?: string | null
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          sangha_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_sangha_id_fkey"
            columns: ["sangha_id"]
            isOneToOne: false
            referencedRelation: "sanghas"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          created_at: string | null
          id: string
          target_vrats: number
          timeframe: Database["public"]["Enums"]["goal_timeframe"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_vrats: number
          timeframe: Database["public"]["Enums"]["goal_timeframe"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_vrats?: number
          timeframe?: Database["public"]["Enums"]["goal_timeframe"]
          user_id?: string
        }
        Relationships: []
      }
      memberships: {
        Row: {
          id: string
          joined_at: string | null
          role: Database["public"]["Enums"]["membership_role"] | null
          sangha_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["membership_role"] | null
          sangha_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: Database["public"]["Enums"]["membership_role"] | null
          sangha_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_sangha_id_fkey"
            columns: ["sangha_id"]
            isOneToOne: false
            referencedRelation: "sanghas"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string
          category: Database["public"]["Enums"]["news_category"] | null
          content: string
          created_at: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category?: Database["public"]["Enums"]["news_category"] | null
          content: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: Database["public"]["Enums"]["news_category"] | null
          content?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      news_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          news_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          news_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          news_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_comments_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      news_likes: {
        Row: {
          created_at: string | null
          id: string
          news_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          news_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          news_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_likes_news_id_fkey"
            columns: ["news_id"]
            isOneToOne: false
            referencedRelation: "news"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string | null
          id: string
          note: string
          user_id: string
          vrat_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note: string
          user_id: string
          vrat_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string
          user_id?: string
          vrat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_vrat_id_fkey"
            columns: ["vrat_id"]
            isOneToOne: false
            referencedRelation: "vrat_records"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          time: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          time?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          time?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profile_updates: {
        Row: {
          field_changed: string
          id: string
          new_value: Json | null
          old_value: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          field_changed: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          field_changed?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          otp_verified: boolean | null
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          otp_verified?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          otp_verified?: boolean | null
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          status: Database["public"]["Enums"]["rsvp_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          status?: Database["public"]["Enums"]["rsvp_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          status?: Database["public"]["Enums"]["rsvp_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      sanghas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_sangha_id: string | null
          privacy: Database["public"]["Enums"]["sangha_privacy"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_sangha_id?: string | null
          privacy?: Database["public"]["Enums"]["sangha_privacy"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_sangha_id?: string | null
          privacy?: Database["public"]["Enums"]["sangha_privacy"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sanghas_parent_sangha_id_fkey"
            columns: ["parent_sangha_id"]
            isOneToOne: false
            referencedRelation: "sanghas"
            referencedColumns: ["id"]
          },
        ]
      }
      vrat_records: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_retrospective: boolean | null
          note: string | null
          sangha_id: string | null
          status: Database["public"]["Enums"]["vrat_status"] | null
          user_id: string
          vrat_type: Database["public"]["Enums"]["vrat_type"]
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_retrospective?: boolean | null
          note?: string | null
          sangha_id?: string | null
          status?: Database["public"]["Enums"]["vrat_status"] | null
          user_id: string
          vrat_type: Database["public"]["Enums"]["vrat_type"]
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_retrospective?: boolean | null
          note?: string | null
          sangha_id?: string | null
          status?: Database["public"]["Enums"]["vrat_status"] | null
          user_id?: string
          vrat_type?: Database["public"]["Enums"]["vrat_type"]
        }
        Relationships: [
          {
            foreignKeyName: "vrat_records_sangha_id_fkey"
            columns: ["sangha_id"]
            isOneToOne: false
            referencedRelation: "sanghas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      blog_category: "spiritual" | "community" | "teachings" | "personal"
      event_type: "fasting" | "talent_show" | "spiritual" | "community"
      goal_timeframe: "30d" | "90d" | "365d"
      membership_role: "member" | "admin"
      news_category: "news" | "announcement" | "spiritual"
      notification_type:
        | "daily_prompt"
        | "festival_alert"
        | "tithi"
        | "community_update"
      rsvp_status: "going" | "not_going" | "interested"
      sangha_privacy: "public" | "private"
      vrat_status: "success" | "tried" | "fail"
      vrat_type: "upvas" | "ekasna" | "ayambil" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blog_category: ["spiritual", "community", "teachings", "personal"],
      event_type: ["fasting", "talent_show", "spiritual", "community"],
      goal_timeframe: ["30d", "90d", "365d"],
      membership_role: ["member", "admin"],
      news_category: ["news", "announcement", "spiritual"],
      notification_type: [
        "daily_prompt",
        "festival_alert",
        "tithi",
        "community_update",
      ],
      rsvp_status: ["going", "not_going", "interested"],
      sangha_privacy: ["public", "private"],
      vrat_status: ["success", "tried", "fail"],
      vrat_type: ["upvas", "ekasna", "ayambil", "other"],
    },
  },
} as const
