export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      exercises_pool: {
        Row: {
          id: string
          source_key: string
          unit_id: string
          lesson_id: string
          lesson_position: number
          exercise_position: number
          exercise_type: string
          concept_tag: string
          base_difficulty: number
          content: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          source_key: string
          unit_id: string
          lesson_id: string
          lesson_position: number
          exercise_position: number
          exercise_type: string
          concept_tag: string
          base_difficulty?: number
          content: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          source_key?: string
          unit_id?: string
          lesson_id?: string
          lesson_position?: number
          exercise_position?: number
          exercise_type?: string
          concept_tag?: string
          base_difficulty?: number
          content?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      learner_preferences: {
        Row: {
          user_id: string
          goal: string | null
          start_level: string | null
          contexts: string[]
          daily_minutes: number | null
          reminder_enabled: boolean
          reminder_time: string | null
          onboarding_step: string
          onboarded_at: string | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          goal?: string | null
          start_level?: string | null
          contexts?: string[]
          daily_minutes?: number | null
          reminder_enabled?: boolean
          reminder_time?: string | null
          onboarding_step?: string
          onboarded_at?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          goal?: string | null
          start_level?: string | null
          contexts?: string[]
          daily_minutes?: number | null
          reminder_enabled?: boolean
          reminder_time?: string | null
          onboarding_step?: string
          onboarded_at?: string | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          user_id: string
          lesson_id: string
          status: string
          step: number
          results: string[]
          xp: number
          started_at: string
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          lesson_id: string
          status?: string
          step?: number
          results?: string[]
          xp?: number
          started_at?: string
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          lesson_id?: string
          status?: string
          step?: number
          results?: string[]
          xp?: number
          started_at?: string
          completed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      mistakes: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          item_key: string
          topic: string | null
          prompt: string
          learner_answer: string
          correct_answer: string
          reason: string
          miss_count: number
          created_at: string
          updated_at: string
          learned_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          item_key: string
          topic?: string | null
          prompt: string
          learner_answer: string
          correct_answer: string
          reason: string
          miss_count?: number
          created_at?: string
          updated_at?: string
          learned_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          item_key?: string
          topic?: string | null
          prompt?: string
          learner_answer?: string
          correct_answer?: string
          reason?: string
          miss_count?: number
          created_at?: string
          updated_at?: string
          learned_at?: string | null
        }
        Relationships: []
      }
      placement_attempts: {
        Row: {
          user_id: string
          answers: number[]
          current_question: number
          suggested_level: string | null
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          answers?: number[]
          current_question?: number
          suggested_level?: string | null
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          answers?: number[]
          current_question?: number
          suggested_level?: string | null
          completed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      review_items: {
        Row: {
          id: string
          user_id: string
          item_key: string
          source: string
          lesson_id: string
          article: string | null
          word: string
          en: string
          example_de: string | null
          example_en: string | null
          strength: number
          due_at: string
          last_reviewed_at: string | null
          review_count: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          item_key: string
          source: string
          lesson_id: string
          article?: string | null
          word: string
          en: string
          example_de?: string | null
          example_en?: string | null
          strength?: number
          due_at: string
          last_reviewed_at?: string | null
          review_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          item_key?: string
          source?: string
          lesson_id?: string
          article?: string | null
          word?: string
          en?: string
          example_de?: string | null
          example_en?: string | null
          strength?: number
          due_at?: string
          last_reviewed_at?: string | null
          review_count?: number
          created_at?: string
        }
        Relationships: []
      }
      saved_phrases: {
        Row: {
          id: string
          user_id: string
          phrase_key: string
          lesson_id: string
          de: string
          en: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phrase_key: string
          lesson_id: string
          de: string
          en: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phrase_key?: string
          lesson_id?: string
          de?: string
          en?: string
          created_at?: string
        }
        Relationships: []
      }
      standup_completions: {
        Row: {
          user_id: string
          unit_id: string
          completed_at: string
        }
        Insert: {
          user_id: string
          unit_id: string
          completed_at?: string
        }
        Update: {
          user_id?: string
          unit_id?: string
          completed_at?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          id: number
          user_id: string
          source: string
          ref: string
          local_date: string
          amount: number
          created_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
      daily_activity: {
        Row: {
          user_id: string
          local_date: string
          xp: number
          goal_xp: number
          updated_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
      streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          freezes: number
          frozen_dates: string[]
          updated_at: string
        }
        Insert: never
        Update: never
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      delete_my_account: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      award_xp: {
        Args: { p_source: string; p_ref: string; p_amount?: number | null }
        Returns: Json
      }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
