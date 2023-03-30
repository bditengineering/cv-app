import type { ComponentType } from "react";

export type ExtractProps<T> = T extends ComponentType<infer P> ? P : T;

interface CvSkillResponse {
  id: string;
  cv_id: string;
  skill_id: string;
}

interface SkillResponse {
  id: string;
  name: string;
  skill_group: {
    id: string;
    name: string;
  };
}

interface Skill {
  id: string;
  name: string;
}

interface SkillGroup {
  [group_name: string]: Array<Skill>;
}

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
  titles: Title;
  user: User;
}

export interface Title {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export interface User {
  id: string;
  email: string;
}
