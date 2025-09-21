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
      ab_tests: {
        Row: {
          created_at: string | null
          id: string
          metric: string
          name: string
          variant: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metric: string
          name: string
          variant: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metric?: string
          name?: string
          variant?: string
        }
        Relationships: []
      }
      billing_plans: {
        Row: {
          code: string
          is_lifetime: boolean | null
          name: string
          period: string | null
          price_cents: number | null
        }
        Insert: {
          code: string
          is_lifetime?: boolean | null
          name: string
          period?: string | null
          price_cents?: number | null
        }
        Update: {
          code?: string
          is_lifetime?: boolean | null
          name?: string
          period?: string | null
          price_cents?: number | null
        }
        Relationships: []
      }
      chat_parses: {
        Row: {
          created_at: string | null
          id: string
          needs_confirmation: boolean | null
          raw_text: string | null
          speaker_confidence: number | null
          turns: Json | null
          upload_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          needs_confirmation?: boolean | null
          raw_text?: string | null
          speaker_confidence?: number | null
          turns?: Json | null
          upload_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          needs_confirmation?: boolean | null
          raw_text?: string | null
          speaker_confidence?: number | null
          turns?: Json | null
          upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_parses_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_outcomes: {
        Row: {
          created_at: string | null
          feedback_score: number | null
          id: string
          notes: string | null
          outcome: string | null
          suggestion_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_score?: number | null
          id?: string
          notes?: string | null
          outcome?: string | null
          suggestion_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_score?: number | null
          id?: string
          notes?: string | null
          outcome?: string | null
          suggestion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_outcomes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      image_checks: {
        Row: {
          created_at: string | null
          id: string
          matches: Json | null
          phash: string | null
          risk_score: number | null
          upload_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          matches?: Json | null
          phash?: string | null
          risk_score?: number | null
          upload_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          matches?: Json | null
          phash?: string | null
          risk_score?: number | null
          upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_checks_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_logs: {
        Row: {
          action: string
          created_at: string | null
          entity: string | null
          id: string
          meta: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          entity?: string | null
          id?: string
          meta?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          entity?: string | null
          id?: string
          meta?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          blocked_topics: string[] | null
          created_at: string | null
          id: string
          locale: string | null
          tone: Json | null
          tz: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blocked_topics?: string[] | null
          created_at?: string | null
          id?: string
          locale?: string | null
          tone?: Json | null
          tz?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blocked_topics?: string[] | null
          created_at?: string | null
          id?: string
          locale?: string | null
          tone?: Json | null
          tz?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          plan_code: string | null
          renews_at: string | null
          started_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          id?: string
          plan_code?: string | null
          renews_at?: string | null
          started_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          id?: string
          plan_code?: string | null
          renews_at?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_code_fkey"
            columns: ["plan_code"]
            isOneToOne: false
            referencedRelation: "billing_plans"
            referencedColumns: ["code"]
          },
        ]
      }
      suggestions: {
        Row: {
          accepted: boolean | null
          created_at: string | null
          id: string
          parse_id: string | null
          style: Json | null
          suggestion: string
          tts_path: string | null
          user_id: string
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string | null
          id?: string
          parse_id?: string | null
          style?: Json | null
          suggestion: string
          tts_path?: string | null
          user_id: string
        }
        Update: {
          accepted?: boolean | null
          created_at?: string | null
          id?: string
          parse_id?: string | null
          style?: Json | null
          suggestion?: string
          tts_path?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_parse_id_fkey"
            columns: ["parse_id"]
            isOneToOne: false
            referencedRelation: "chat_parses"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          created_at: string | null
          id: string
          kind: string
          mime: string | null
          redacted: boolean | null
          size_bytes: number | null
          storage_path: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          kind: string
          mime?: string | null
          redacted?: boolean | null
          size_bytes?: number | null
          storage_path?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          kind?: string
          mime?: string | null
          redacted?: boolean | null
          size_bytes?: number | null
          storage_path?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voice_notes: {
        Row: {
          created_at: string | null
          duration_sec: number | null
          id: string
          lang: string | null
          transcript: string | null
          upload_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_sec?: number | null
          id?: string
          lang?: string | null
          transcript?: string | null
          upload_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_sec?: number | null
          id?: string
          lang?: string | null
          transcript?: string | null
          upload_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_notes_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      rpc_purge_my_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
