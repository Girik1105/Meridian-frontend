export interface TasterModule {
  id: string;
  title: string;
  type: "read" | "exercise" | "reflect";
  content: string;
  estimated_minutes: number;
}

export interface TasterContent {
  skill_name: string;
  estimated_minutes: number;
  modules: TasterModule[];
  reflection_prompts: string[];
}

export interface TasterResponse {
  id: string;
  module_id: string;
  user_response: string;
  time_spent_seconds: number;
  created_at: string;
}

export interface SkillTaster {
  id: string;
  career_path: string | null;
  skill_name: string;
  taster_content: TasterContent;
  status: "not_started" | "in_progress" | "completed";
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillTasterDetail extends SkillTaster {
  responses: TasterResponse[];
  assessment: TasterAssessment | null;
}

export interface TasterAssessment {
  summary: string;
  strengths: string[];
  friction_points: string[];
  engagement_signals: Record<string, string | number>;
  next_steps: string[];
  disclaimer: string;
}
