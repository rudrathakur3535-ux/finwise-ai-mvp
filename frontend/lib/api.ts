import { UserProfileData, AdvisorResponse } from "./types";

// Production me Railway ka URL use hoga, Local me 8000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getInvestmentAdvice(data: UserProfileData): Promise<AdvisorResponse> {
  const response = await fetch(`${API_BASE_URL}/api/advice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Backend needs specific fields, so we map our form data properly
    body: JSON.stringify({
      age: data.age,
      monthly_income: data.monthly_income,
      monthly_savings: data.monthly_savings,
      risk_appetite: data.risk_appetite,
      horizon_years: data.horizon_years,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch advice: ${response.statusText}. Details: ${errorBody}`);
  }

  return response.json();
}

export async function explainFund(fundName: string, data: any): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/explain-fund`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fund_name: fundName,
      user_profile: {
        age: data.age,
        monthly_income: data.monthly_income,
        monthly_savings: data.monthly_savings,
        risk_appetite: data.risk_appetite,
        horizon_years: data.horizon_years,
      }
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get explanation");
  }

  const result = await response.json();
  return result.explanation;
}
