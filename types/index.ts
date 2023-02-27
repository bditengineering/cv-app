import { Database } from "./supabase";

export type _Education = {
  cv_id?: string;
  degree: string;
  end_year: string;
  start_year: string;
  university_name: string;
};

export type _Project = {
  created_at: Date;
  cv_id?: string;
  date_end: Date;
  date_start: Date;
  description: string;
  field: string;
  id: string;
  name: string;
  ongoing: boolean;
  position: string;
  responsibilities: Array<string>;
  team_size: number;
  technologies: Array<string>;
};

export type Certificate = {
  certificate_name: string;
  created_at: Date;
  cv_id?: string;
  description: string;
  id: string;
};

export type CV = {
  id?: string;
  certifications: Array<Certificate>;
  created_at?: string;
  created_by?: string;
  education: Education;
  english_spoken_level: string;
  english_written_level: string;
  first_name: string;
  last_name: string;
  personal_qualities: Array<string>;
  projects: Array<Project>;
  summary: string;
  technical_skills: string[];
};

export type Project<T extends "Row" | "Insert" | "Update" = "Row"> = Database["public"]["Tables"]["projects"][T] & {
  T: {
    date_start: Database["public"]["Tables"]["projects"][T]["date_start"] | Date,
    date_end: Database["public"]["Tables"]["projects"][T]["date_end"] | Date,
  }
};
export type Education<T extends "Row" | "Insert" | "Update" = "Row"> = Database["public"]["Tables"]["education"][T];
export type Certification<T extends "Row" | "Insert" | "Update" = "Row"> = Database["public"]["Tables"]["certifications"][T];
export type Cv<T extends "Row" | "Insert" | "Update" = "Row"> = Database["public"]["Tables"]["cv"][T];
export type FullCv<T extends "Row" | "Insert" | "Update" = "Row"> = Cv<T> & {
  projects: Array<Project<T>>;
  education: Array<Education<T>>;
  certifications: Array<Certification<T>>;
  technical_skills?: Array<string>;
}
