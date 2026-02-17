export interface ExtractedSkills {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
}

export interface RoundMapping {
  roundTitle: string;
  focusAreas: string[];
  whyItMatters: string;
}

export interface ChecklistRound {
  roundTitle: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
}

export interface CompanyInfo {
  name: string;
  industry: string;
  sizeCategory: "Startup" | "Mid-size" | "Enterprise";
  hiringFocus: string;
}

export interface AnalysisEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  companyInfo: CompanyInfo | null;
  roundMapping: RoundMapping[];
  checklist: ChecklistRound[];
  plan7Days: DayPlan[];
  questions: string[];
  baseScore: number;
  skillConfidenceMap: Record<string, "know" | "practice">;
  finalScore: number;
  updatedAt: string;
}
