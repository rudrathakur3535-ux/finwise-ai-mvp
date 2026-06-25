export interface UserProfileData {
  name: string;
  age: number;
  monthly_income: number;
  monthly_savings: number;
  risk_appetite: "conservative" | "moderate" | "aggressive";
  goal: string;
  horizon_years: number;
  existing_amount: number;
  city?: string;
  language?: string;
}

export interface FundProjection {
  monthly_sip: number;
  total_invested: number;
  expected_corpus: number;
  total_gain: number;
  gain_percentage: number;
  pessimistic: number;
  base: number;
  optimistic: number;
}

export interface RecommendedFund {
  scheme_code: string;
  name: string;
  category: string;
  risk_level: string;
  description: string;
  allocated_percentage: number;
  monthly_sip: number;
  returns: {
    "1y": number;
    "3y": number;
    "5y": number;
  };
  expense_ratio: number;
  aum_cr: number;
  data_source: string;
  projection: FundProjection;
  warning: string | null;
  live_nav?: number | null;
  nav_date?: string | null;
}

export interface PortfolioAllocation {
  equity_percent: number;
  safe_percent: number;
  gold_percent: number;
  detail: Record<string, number>;
}

export interface RiskAssessment {
  score: number;
  max_score: number;
  category: string;
  emoji: string;
  tagline: string;
  color: string;
  description: string;
  breakdown: Record<string, any>;
}

export interface AdvisorResponse {
  status: string;
  user_profile: Omit<UserProfileData, "name" | "goal" | "existing_amount" | "city">;
  risk_assessment: RiskAssessment;
  portfolio: {
    allocation: PortfolioAllocation;
    total_sip: number;
    total_corpus: number;
  };
  recommended_funds: RecommendedFund[];
  ai_advice: string;
}

export interface TaxSavingData {
  eligible_80c_amount: number;
  recommended_elss_sip: number;
  tax_saved: number;
  tax_bracket: string;
}

export interface TaxSavingResponse {
  status: string;
  tax_data: TaxSavingData;
  recommended_funds: RecommendedFund[];
  ai_advice: string;
}
