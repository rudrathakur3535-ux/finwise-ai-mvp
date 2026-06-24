code = """
export async function getTaxSavingAdvice(monthlyIncome: number) {
  const response = await fetch(`${API_BASE_URL}/api/tax-saving?monthly_income=${monthlyIncome}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get tax saving advice");
  }

  return response.json();
}
"""
with open("c:/Users/rudra/OneDrive/Desktop/finence ai/frontend/lib/api.ts", "a", encoding="utf-8") as f:
    f.write("\n" + code + "\n")
