# =============================================================
# SIMULATOR ROUTER — /api/simulate
# =============================================================

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from database.connection import get_db
from services.auth_service import get_current_user_optional
from services.simulator_service import run_simulation
from services.ai_explainer import client as gemini_client
from datetime import datetime
import logging

logger = logging.getLogger("simulator")

router = APIRouter(prefix="/api", tags=["Simulator"])


# ── Request / Response Models ─────────────────────────────────────────────────

class SimulateRequest(BaseModel):
    # Base financial snapshot
    monthly_income: float = 50000
    monthly_expenses: float = 30000
    monthly_savings: float = 20000
    existing_investments: float = 0
    age: int = 30
    horizon_years: int = 10
    risk_profile: str = "moderate"
    base_sip: float = 5000
    base_emi: float = 0

    # Scenario deltas
    delta_sip: float = 0            # additional SIP amount
    delta_emi: float = 0            # new EMI added
    income_change_pct: float = 0    # % income change (-20 to +100)
    one_time_expense: float = 0     # one-time big expense
    new_risk_profile: str = "moderate"


# ── Helper: Gemini Hinglish Summary ──────────────────────────────────────────

def generate_simulation_summary(result: dict, request: SimulateRequest) -> str:
    try:
        prompt = f"""You are FinWise AI, a friendly Hinglish financial advisor.

A user ran a "What-If Life Simulator" and got these results:
- Financial Health Score: {result['healthScore']}/100
- Risk Category: {result['riskCategory']}
- Projected Net Worth → 1 year: ₹{result['projectedNetWorth']['1yr']:,} | 5 years: ₹{result['projectedNetWorth']['5yr']:,} | 10 years: ₹{result['projectedNetWorth']['10yr']:,}
- New SIP: ₹{result['computedValues']['newMonthlySip']:,}/month
- New EMI: ₹{result['computedValues']['newMonthlyEmi']:,}/month
- Income change: {request.income_change_pct:+.0f}%
- One-time expense: ₹{request.one_time_expense:,}
- Recommended Action: {result['recommendedAction']}

Write a 2-3 line NATURAL Hinglish summary of this scenario's impact.
Be specific about numbers. Be encouraging but honest. No markdown, no bullet points.
Example style: "Agar aap EMI lete hain, aapka 5-saal net worth ₹4.2L kam ho sakta hai..."
"""
        models = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]
        for model in models:
            try:
                response = gemini_client.models.generate_content(model=model, contents=prompt)
                return response.text.strip()
            except Exception as e:
                logger.warning(f"Gemini {model} failed: {e}")
                continue
    except Exception as e:
        logger.error(f"Summary generation failed: {e}")

    return f"Aapka financial health score {result['healthScore']}/100 hai. 10 saal mein projected net worth ₹{result['projectedNetWorth']['10yr']:,} ho sakta hai. {result['recommendedAction']}"


# ── Main Endpoint ──────────────────────────────────────────────────────────────

@router.post("/simulate")
async def simulate(
    request: SimulateRequest,
    current_user: Optional[dict] = Depends(get_current_user_optional),
    db=Depends(get_db)
):
    try:
        payload = request.model_dump()
        result = run_simulation(payload)

        # Gemini summary
        summary = generate_simulation_summary(result, request)
        result["aiSummary"] = summary

        # Save to MongoDB if user is logged in
        if current_user and db is not None:
            try:
                await db.simulations.insert_one({
                    "user_id": current_user.get("user_id"),
                    "created_at": datetime.utcnow().isoformat(),
                    "inputs": payload,
                    "result": result
                })
            except Exception as e:
                logger.warning(f"MongoDB save failed: {e}")

        return result

    except Exception as e:
        logger.error(f"Simulation error: {e}")
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
