export interface WorkExperience {
  position: string;
  company: string;
  location: string;
  workMode: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

export interface EducationExperience {
  degree: string;
  institution: string;
  completionDate: string;
  description: string;
}