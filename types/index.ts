export type Education = {
  cv_id?: string;
  degree: string;
  end_year: string;
  start_year: string;
  university_name: string;
};

export type Project = {
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
