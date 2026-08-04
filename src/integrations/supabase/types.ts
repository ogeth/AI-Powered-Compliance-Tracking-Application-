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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          business_id: string | null
          created_at: string
          description: string
          event_type: string
          id: string
          record_id: string | null
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          description: string
          event_type: string
          id?: string
          record_id?: string | null
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          description?: string
          event_type?: string
          id?: string
          record_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_events_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "business_records"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_address: string | null
          created_at: string
          entity_type: string
          formation_date: string | null
          id: string
          legal_name: string
          management_structure: string
          member_count: number
          onboarding_completed: boolean
          operating_agreement_status: string
          ownership_type: string
          registered_agent: string | null
          state_of_formation: string
          tax_classification: string | null
          trading_name: string | null
          updated_at: string
          user_id: string
          user_role: string
        }
        Insert: {
          business_address?: string | null
          created_at?: string
          entity_type?: string
          formation_date?: string | null
          id?: string
          legal_name: string
          management_structure?: string
          member_count?: number
          onboarding_completed?: boolean
          operating_agreement_status?: string
          ownership_type?: string
          registered_agent?: string | null
          state_of_formation?: string
          tax_classification?: string | null
          trading_name?: string | null
          updated_at?: string
          user_id: string
          user_role?: string
        }
        Update: {
          business_address?: string | null
          created_at?: string
          entity_type?: string
          formation_date?: string | null
          id?: string
          legal_name?: string
          management_structure?: string
          member_count?: number
          onboarding_completed?: boolean
          operating_agreement_status?: string
          ownership_type?: string
          registered_agent?: string | null
          state_of_formation?: string
          tax_classification?: string | null
          trading_name?: string | null
          updated_at?: string
          user_id?: string
          user_role?: string
        }
        Relationships: []
      }
      business_records: {
        Row: {
          approvers: string | null
          assumptions: Json
          business_id: string | null
          completed_at: string | null
          created_at: string
          effective_date: string | null
          event_date: string | null
          event_description: string | null
          facts_used: Json
          generated_content: Json
          id: string
          meeting_occurred: string | null
          missing_information: Json
          participants: string | null
          professional_review_recommended: boolean
          recommendation_reason: string | null
          record_type: string
          risk_flags: Json
          status: string
          template_version: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approvers?: string | null
          assumptions?: Json
          business_id?: string | null
          completed_at?: string | null
          created_at?: string
          effective_date?: string | null
          event_date?: string | null
          event_description?: string | null
          facts_used?: Json
          generated_content?: Json
          id?: string
          meeting_occurred?: string | null
          missing_information?: Json
          participants?: string | null
          professional_review_recommended?: boolean
          recommendation_reason?: string | null
          record_type: string
          risk_flags?: Json
          status?: string
          template_version?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approvers?: string | null
          assumptions?: Json
          business_id?: string | null
          completed_at?: string | null
          created_at?: string
          effective_date?: string | null
          event_date?: string | null
          event_description?: string | null
          facts_used?: Json
          generated_content?: Json
          id?: string
          meeting_occurred?: string | null
          missing_information?: Json
          participants?: string | null
          professional_review_recommended?: boolean
          recommendation_reason?: string | null
          record_type?: string
          risk_flags?: Json
          status?: string
          template_version?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_records_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          id: string
          product_updates: boolean
          record_reminders: boolean
          roadmap_updates: boolean
          security_alerts: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_updates?: boolean
          record_reminders?: boolean
          roadmap_updates?: boolean
          security_alerts?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_updates?: boolean
          record_reminders?: boolean
          roadmap_updates?: boolean
          security_alerts?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      supporting_documents: {
        Row: {
          business_id: string | null
          category: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          record_id: string | null
          storage_path: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          category?: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          record_id?: string | null
          storage_path: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          category?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          record_id?: string | null
          storage_path?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supporting_documents_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supporting_documents_record_id_fkey"
            columns: ["record_id"]
            isOneToOne: false
            referencedRelation: "business_records"
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
