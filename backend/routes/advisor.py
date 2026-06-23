# =============================================
# ADVISOR ROUTER — FinWise AI ka Main API
# Frontend se data aata hai → Pura pipeline
# chalta hai → Final result jaata hai
# =============================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

# Apne services import karo
from services.risk_scorer   import calculate_risk_score
from services.allocator     import get_allocation, get_allocation_summary
from services.fund_selector import select_funds
from services.ai_explainer  import generate_advice

# Router banao — isse main.py mein attach karenge
router = APIRouter(
    prefix="/api",
    tags=["Advisor"]
)


# ----------------------------------------
# REQUEST MODEL — Frontend se yeh data aayega
# Pydantic se validation automatic hoga
# ----------------------------------------
class UserProfile(BaseModel):
    """
    User ka financial profile.
    Frontend se yeh JSON aayega POST request mein.
    """
    age:             int   = Field(..., ge=18, le=80,     description="User ki age (18-80)")
    monthly_income:  float = Field(..., gt=0,             description="Monthly income in ₹")
    monthly_savings: float = Field(..., ge=0,             description="Monthly savings in ₹")
    risk_appetite:   str   = Field(...,                   description="conservative / moderate / aggressive")
    horizon_years:   int   = Field(..., ge=1, le=30,      description="Investment horizon (1-30 years)")


# ----------------------------------------
# MAIN ENDPOINT — /api/advice
# Yeh pura pipeline chalata hai:
# Profile → Risk → Allocation → Funds → AI
# ----------------------------------------
@router.post("/advice")
async def get_financial_advice(profile: UserProfile):
    """
    🧠 FinWise AI ka main endpoint.

    Flow:
    1. User profile se risk score calculate karo
    2. Risk score se portfolio allocation decide karo
    3. Allocation se best funds select karo
    4. Gemini AI se personalized advice lo
    5. Sab combine karke response bhejo
    """

    try:
        # ----- STEP 1: Risk Score -----
        profile_dict = profile.model_dump()
        risk_result  = calculate_risk_score(profile_dict)

        # ----- STEP 2: Portfolio Allocation -----
        allocation         = get_allocation(risk_result["score"], profile.horizon_years)
        allocation_summary = get_allocation_summary(allocation)

        # ----- STEP 3: Fund Selection -----
        selected_funds = select_funds(
            allocation      = allocation,
            monthly_savings = profile.monthly_savings,
            horizon_years   = profile.horizon_years
        )

        # ----- STEP 4: AI Advice (Gemini) -----
        ai_advice = generate_advice(
            profile        = profile_dict,
            risk_result    = risk_result,
            allocation     = allocation,
            selected_funds = selected_funds
        )

        # ----- STEP 5: Total SIP Calculate -----
        total_sip    = sum(f["monthly_sip"] for f in selected_funds)
        total_corpus = sum(f["projection"]["base"] for f in selected_funds)

        # ----- FINAL RESPONSE -----
        return {
            "status": "success",

            "user_profile": {
                "age":             profile.age,
                "monthly_income":  profile.monthly_income,
                "monthly_savings": profile.monthly_savings,
                "risk_appetite":   profile.risk_appetite,
                "horizon_years":   profile.horizon_years,
            },

            "risk_assessment": {
                "score":       risk_result["score"],
                "max_score":   risk_result["max_score"],
                "category":    risk_result["category"],
                "emoji":       risk_result["emoji"],
                "tagline":     risk_result["tagline"],
                "color":       risk_result["color"],
                "description": risk_result["description"],
                "breakdown":   risk_result["breakdown"],
            },

            "portfolio": {
                "allocation":   allocation_summary,
                "total_sip":    total_sip,
                "total_corpus": total_corpus,
            },

            "recommended_funds": selected_funds,

            "ai_advice": ai_advice,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"FinWise AI Error: {str(e)}"
        )


# ----------------------------------------
# SECONDARY ENDPOINT — /api/explain-fund
# "Why this fund?" button ke liye
# ----------------------------------------
class ExplainRequest(BaseModel):
    fund_name: str
    user_profile: UserProfile

@router.post("/explain-fund")
async def explain_fund_route(req: ExplainRequest):
    try:
        from services.ai_explainer import explain_fund
        ans = explain_fund(req.fund_name, req.user_profile.model_dump())
        return {"explanation": ans}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
