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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      call_action_items: {
        Row: {
          action: string
          created_at: string
          due_date: string | null
          id: string
          opportunity_id: string
          owner: string | null
          status: Database["public"]["Enums"]["action_item_status"] | null
          updated_at: string
        }
        Insert: {
          action: string
          created_at?: string
          due_date?: string | null
          id?: string
          opportunity_id: string
          owner?: string | null
          status?: Database["public"]["Enums"]["action_item_status"] | null
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          due_date?: string | null
          id?: string
          opportunity_id?: string
          owner?: string | null
          status?: Database["public"]["Enums"]["action_item_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_action_items_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      call_assessments: {
        Row: {
          assessed_at: string | null
          based_on_docs: boolean | null
          complexity_notes: string | null
          created_at: string
          effort_score: number | null
          eligibility: Database["public"]["Enums"]["eligibility_status"] | null
          eligibility_notes: string | null
          fit_notes: string | null
          fit_score: number | null
          id: string
          judgment: Database["public"]["Enums"]["call_judgment"] | null
          opportunity_id: string
          recommendation: string | null
          risks: string[] | null
          updated_at: string
        }
        Insert: {
          assessed_at?: string | null
          based_on_docs?: boolean | null
          complexity_notes?: string | null
          created_at?: string
          effort_score?: number | null
          eligibility?: Database["public"]["Enums"]["eligibility_status"] | null
          eligibility_notes?: string | null
          fit_notes?: string | null
          fit_score?: number | null
          id?: string
          judgment?: Database["public"]["Enums"]["call_judgment"] | null
          opportunity_id: string
          recommendation?: string | null
          risks?: string[] | null
          updated_at?: string
        }
        Update: {
          assessed_at?: string | null
          based_on_docs?: boolean | null
          complexity_notes?: string | null
          created_at?: string
          effort_score?: number | null
          eligibility?: Database["public"]["Enums"]["eligibility_status"] | null
          eligibility_notes?: string | null
          fit_notes?: string | null
          fit_score?: number | null
          id?: string
          judgment?: Database["public"]["Enums"]["call_judgment"] | null
          opportunity_id?: string
          recommendation?: string | null
          risks?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_assessments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: true
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      call_documents: {
        Row: {
          content_type: string | null
          created_at: string
          doc_type: string
          download_error: string | null
          downloaded_at: string | null
          file_size: number | null
          id: string
          name: string
          opportunity_id: string
          pages: number | null
          parsed: boolean | null
          storage_path: string | null
          url: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          doc_type?: string
          download_error?: string | null
          downloaded_at?: string | null
          file_size?: number | null
          id?: string
          name: string
          opportunity_id: string
          pages?: number | null
          parsed?: boolean | null
          storage_path?: string | null
          url?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          doc_type?: string
          download_error?: string | null
          downloaded_at?: string | null
          file_size?: number | null
          id?: string
          name?: string
          opportunity_id?: string
          pages?: number | null
          parsed?: boolean | null
          storage_path?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_documents_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      call_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_notes_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_profiles: {
        Row: {
          budget_range: string | null
          completeness: number
          created_at: string
          excluded_themes: string[] | null
          funding_goals: string | null
          geography_preferences: string[] | null
          id: string
          internal_capacity: string | null
          notes: string | null
          organization_id: string
          partnership_readiness: string | null
          preferred_sources: string[] | null
          preferred_types: string[] | null
          prior_experience: string | null
          updated_at: string
        }
        Insert: {
          budget_range?: string | null
          completeness?: number
          created_at?: string
          excluded_themes?: string[] | null
          funding_goals?: string | null
          geography_preferences?: string[] | null
          id?: string
          internal_capacity?: string | null
          notes?: string | null
          organization_id: string
          partnership_readiness?: string | null
          preferred_sources?: string[] | null
          preferred_types?: string[] | null
          prior_experience?: string | null
          updated_at?: string
        }
        Update: {
          budget_range?: string | null
          completeness?: number
          created_at?: string
          excluded_themes?: string[] | null
          funding_goals?: string | null
          geography_preferences?: string[] | null
          id?: string
          internal_capacity?: string | null
          notes?: string | null
          organization_id?: string
          partnership_readiness?: string | null
          preferred_sources?: string[] | null
          preferred_types?: string[] | null
          prior_experience?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          agent_risk_alerts: boolean
          created_at: string
          deadline_reminders: boolean
          id: string
          updated_at: string
          user_id: string
          weekly_digest: boolean
        }
        Insert: {
          agent_risk_alerts?: boolean
          created_at?: string
          deadline_reminders?: boolean
          id?: string
          updated_at?: string
          user_id: string
          weekly_digest?: boolean
        }
        Update: {
          agent_risk_alerts?: boolean
          created_at?: string
          deadline_reminders?: boolean
          id?: string
          updated_at?: string
          user_id?: string
          weekly_digest?: boolean
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          assessment_run_error: string | null
          assessment_run_status: string | null
          blockers: string[] | null
          call_name: string
          complexity: string | null
          created_at: string
          deadline: string | null
          docs_status: Database["public"]["Enums"]["docs_status"] | null
          effort_score: number | null
          eligibility_text: string | null
          fit_score: number | null
          funding_range: string | null
          funding_type: string | null
          geography: string | null
          id: string
          lifecycle: Database["public"]["Enums"]["call_lifecycle"] | null
          organization_id: string
          partner_required: boolean | null
          priority: Database["public"]["Enums"]["call_priority"] | null
          programme: string
          recommended_action: string | null
          source_url: string | null
          summary: string | null
          thematic_area: string | null
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"] | null
          why_difficult: string | null
          why_it_fits: string | null
        }
        Insert: {
          assessment_run_error?: string | null
          assessment_run_status?: string | null
          blockers?: string[] | null
          call_name: string
          complexity?: string | null
          created_at?: string
          deadline?: string | null
          docs_status?: Database["public"]["Enums"]["docs_status"] | null
          effort_score?: number | null
          eligibility_text?: string | null
          fit_score?: number | null
          funding_range?: string | null
          funding_type?: string | null
          geography?: string | null
          id?: string
          lifecycle?: Database["public"]["Enums"]["call_lifecycle"] | null
          organization_id: string
          partner_required?: boolean | null
          priority?: Database["public"]["Enums"]["call_priority"] | null
          programme?: string
          recommended_action?: string | null
          source_url?: string | null
          summary?: string | null
          thematic_area?: string | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
          why_difficult?: string | null
          why_it_fits?: string | null
        }
        Update: {
          assessment_run_error?: string | null
          assessment_run_status?: string | null
          blockers?: string[] | null
          call_name?: string
          complexity?: string | null
          created_at?: string
          deadline?: string | null
          docs_status?: Database["public"]["Enums"]["docs_status"] | null
          effort_score?: number | null
          eligibility_text?: string | null
          fit_score?: number | null
          funding_range?: string | null
          funding_type?: string | null
          geography?: string | null
          id?: string
          lifecycle?: Database["public"]["Enums"]["call_lifecycle"] | null
          organization_id?: string
          partner_required?: boolean | null
          priority?: Database["public"]["Enums"]["call_priority"] | null
          programme?: string
          recommended_action?: string | null
          source_url?: string | null
          summary?: string | null
          thematic_area?: string | null
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
          why_difficult?: string | null
          why_it_fits?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          domain_focus: string[] | null
          id: string
          name: string
          onboarding_complete: boolean
          size: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          domain_focus?: string[] | null
          id?: string
          name: string
          onboarding_complete?: boolean
          size?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          domain_focus?: string[] | null
          id?: string
          name?: string
          onboarding_complete?: boolean
          size?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      action_item_status: "pending" | "done" | "blocked"
      call_judgment: "go" | "watch" | "no_go"
      call_lifecycle:
        | "discovered"
        | "saved"
        | "docs_pending"
        | "docs_ready"
        | "assessment_pending"
        | "assessed"
        | "shortlisted"
        | "rejected"
        | "in_preparation"
        | "awaiting_documents"
        | "drafting"
        | "under_review"
        | "ready_to_submit"
        | "submitted"
        | "archived"
      call_priority: "high" | "medium" | "low"
      docs_status:
        | "not_downloaded"
        | "downloading"
        | "docs_pending"
        | "docs_ready"
      eligibility_status:
        | "eligible"
        | "not_eligible"
        | "uncertain"
        | "needs_manual_review"
      urgency_level: "low" | "medium" | "high" | "critical"
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
      action_item_status: ["pending", "done", "blocked"],
      call_judgment: ["go", "watch", "no_go"],
      call_lifecycle: [
        "discovered",
        "saved",
        "docs_pending",
        "docs_ready",
        "assessment_pending",
        "assessed",
        "shortlisted",
        "rejected",
        "in_preparation",
        "awaiting_documents",
        "drafting",
        "under_review",
        "ready_to_submit",
        "submitted",
        "archived",
      ],
      call_priority: ["high", "medium", "low"],
      docs_status: [
        "not_downloaded",
        "downloading",
        "docs_pending",
        "docs_ready",
      ],
      eligibility_status: [
        "eligible",
        "not_eligible",
        "uncertain",
        "needs_manual_review",
      ],
      urgency_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
