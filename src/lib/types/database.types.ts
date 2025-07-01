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
      // This is a placeholder for your tables.
      // You'll generate this file from your Supabase schema.
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      // This is a placeholder for your enums.
      // You'll generate this file from your Supabase schema.
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 