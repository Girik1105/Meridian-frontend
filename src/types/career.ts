export interface ROIData {
  learning_time_hours: number;
  estimated_cost: number;
  difficulty: "low" | "moderate" | "high";
  salary_uplift: number;
  job_demand_score: number;
  roi_score: number;
  data_source: string;
  methodology: string;
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  estimated_timeline_months: number;
  salary_range: { min: number; max: number };
  match_reasoning: string;
  relevance_score: number;
  is_selected: boolean;
  roi_data: ROIData;
  created_at: string;
  updated_at: string;
}
