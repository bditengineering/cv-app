// auto-generated

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          user_id?: string;
        };
      };
      certifications: {
        Row: {
          certificate_name: string | null;
          created_at: string | null;
          cv_id: string | null;
          description: string;
          id: string;
        };
        Insert: {
          certificate_name?: string | null;
          created_at?: string | null;
          cv_id?: string | null;
          description: string;
          id?: string;
        };
        Update: {
          certificate_name?: string | null;
          created_at?: string | null;
          cv_id?: string | null;
          description?: string;
          id?: string;
        };
      };
      cv: {
        Row: {
          created_at: string | null;
          created_by: string;
          english_spoken_level: string | null;
          english_written_level: string | null;
          first_name: string;
          id: string;
          last_name: string;
          personal_qualities: string[] | null;
          summary: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string;
          english_spoken_level?: string | null;
          english_written_level?: string | null;
          first_name: string;
          id?: string;
          last_name: string;
          personal_qualities?: string[] | null;
          summary?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          english_spoken_level?: string | null;
          english_written_level?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string;
          personal_qualities?: string[] | null;
          summary?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      cv_skill: {
        Row: {
          cv_id: string;
          id: string;
          skill_id: string;
        };
        Insert: {
          cv_id: string;
          id?: string;
          skill_id: string;
        };
        Update: {
          cv_id?: string;
          id?: string;
          skill_id?: string;
        };
      };
      education: {
        Row: {
          created_at: string | null;
          cv_id: string | null;
          degree: string | null;
          end_year: number | null;
          id: string;
          start_year: number | null;
          university_name: string | null;
        };
        Insert: {
          created_at?: string | null;
          cv_id?: string | null;
          degree?: string | null;
          end_year?: number | null;
          id?: string;
          start_year?: number | null;
          university_name?: string | null;
        };
        Update: {
          created_at?: string | null;
          cv_id?: string | null;
          degree?: string | null;
          end_year?: number | null;
          id?: string;
          start_year?: number | null;
          university_name?: string | null;
        };
      };
      projects: {
        Row: {
          created_at: string | null;
          cv_id: string | null;
          date_end: string | null;
          date_start: string | null;
          description: string | null;
          field: string | null;
          id: string;
          name: string;
          ongoing: boolean;
          position: string | null;
          responsibilities: string[] | null;
          team_size: number | null;
          technologies: string[] | null;
        };
        Insert: {
          created_at?: string | null;
          cv_id?: string | null;
          date_end?: string | null;
          date_start?: string | null;
          description?: string | null;
          field?: string | null;
          id?: string;
          name: string;
          ongoing?: boolean;
          position?: string | null;
          responsibilities?: string[] | null;
          team_size?: number | null;
          technologies?: string[] | null;
        };
        Update: {
          created_at?: string | null;
          cv_id?: string | null;
          date_end?: string | null;
          date_start?: string | null;
          description?: string | null;
          field?: string | null;
          id?: string;
          name?: string;
          ongoing?: boolean;
          position?: string | null;
          responsibilities?: string[] | null;
          team_size?: number | null;
          technologies?: string[] | null;
        };
      };
      skill: {
        Row: {
          id: string;
          name: string;
          skill_group_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          skill_group_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          skill_group_id?: string;
        };
      };
      skill_group: {
        Row: {
          id: string;
          name: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
        };
        Update: {
          id?: string;
          name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
