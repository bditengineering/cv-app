import type { ComponentType } from "react";

export type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;
export interface CV {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
  summary: string;
  university: string;
  degree: string;
  university_end: string;
  university_start: string;
  english_spoken: string;
  english_written: string;
  projects: Array;
  certifications: Array;
  personal_qualities: Array;
  technical_skills: Array;
  positions: POSITION;
  user: USER;
}

export interface POSITION {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export interface USER {
  id: string;
  email: string;
}
