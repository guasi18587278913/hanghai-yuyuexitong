export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      available_slots: {
        Row: {
          coach_id: string
          end_time: string
          id: number
          is_booked: boolean
          start_time: string
        }
        Insert: {
          coach_id: string
          end_time: string
          id?: number
          is_booked?: boolean
          start_time: string
        }
        Update: {
          coach_id?: string
          end_time?: string
          id?: number
          is_booked?: boolean
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "available_slots_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          id: number
          slot_id: number
          status: Database["public"]["Enums"]["booking_status"]
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          slot_id: number
          status?: Database["public"]["Enums"]["booking_status"]
          student_id: string
        }
        Update: {
          created_at?: string
          id?: number
          slot_id?: number
          status?: Database["public"]["Enums"]["booking_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: true
            referencedRelation: "available_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coaches: {
        Row: {
          bio: string | null
          id: string
          specialization: string | null
        }
        Insert: {
          bio?: string | null
          id: string
          specialization?: string | null
        }
        Update: {
          bio?: string | null
          id?: string
          specialization?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaches_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_coach_assignments: {
        Row: {
          coach_id: string
          id: number
          student_id: string
        }
        Insert: {
          coach_id: string
          id?: number
          student_id: string
        }
        Update: {
          coach_id?: string
          id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_coach_assignments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_coach_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_assigned_coach: {
        Args: {
          p_student_id: string
        }
        Returns: string
      }
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      booking_status:
        | "confirmed"
        | "cancelled_by_student"
        | "cancelled_by_coach"
      user_role: "student" | "coach" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
