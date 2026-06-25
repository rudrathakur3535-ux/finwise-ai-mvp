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
    name:            str   = Field(default="",            description="User ka naam")
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
        
        # ----- STEP 3.5: Fetch Live NAV from AMFI -----
        from services.amfi_fetcher import get_live_nav
        for fund in selected_funds:
            live_data = await get_live_nav(fund["scheme_code"])
            if live_data:
                fund["live_nav"] = live_data["nav"]
                fund["nav_date"] = live_data["date"]
            else:
                fund["live_nav"] = None
                fund["nav_date"] = None

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

# ----------------------------------------
# TAX SAVING ENDPOINT — /api/tax-saving
# ----------------------------------------
@router.get("/tax-saving")
async def get_tax_saving(monthly_income: float):
    try:
        import json
        from services.tax_calculator import calculate_tax_savings
        from services.ai_explainer import generate_tax_advice
        from services.amfi_fetcher import get_live_nav
        
        annual_income = monthly_income * 12
        tax_data = calculate_tax_savings(annual_income)
        
        # Load ELSS funds
        with open("data/funds_data.json", "r", encoding="utf-8") as f:
            all_funds = json.load(f)
            
        elss_funds = [fund for fund in all_funds if fund.get("category") == "ELSS Tax Saver"]
        top_elss = elss_funds[:3] # Pick top 3
        
        sip_per_fund = tax_data["recommended_elss_sip"] / 3 if tax_data["recommended_elss_sip"] > 0 else 0
        
        # Inject missing fields for FundCard
        for fund in top_elss:
            fund["monthly_sip"] = sip_per_fund
            fund["allocated_percentage"] = round(100 / 3, 1)
            fund["warning"] = "3-Year Lock-in Period"
            
            rate = fund["returns"]["3y"] / 100
            months = 36 # 3 years
            if sip_per_fund > 0 and rate > 0:
                monthly_rate = rate / 12
                corpus = sip_per_fund * (((1 + monthly_rate)**months - 1) / monthly_rate) * (1 + monthly_rate)
            else:
                corpus = sip_per_fund * months
                
            fund["projection"] = {
                "base": corpus,
                "best": corpus * 1.1,
                "worst": corpus * 0.9
            }
        # Inject live NAV for the selected ELSS funds
        for fund in top_elss:
            live_data = await get_live_nav(fund["scheme_code"])
            if live_data:
                fund["live_nav"] = live_data["nav"]
                fund["nav_date"] = live_data["date"]
            else:
                fund["live_nav"] = None
                fund["nav_date"] = None
                
        # Generate Gemini advice
        ai_advice = generate_tax_advice(
            monthly_income=monthly_income,
            tax_saved=tax_data["tax_saved"],
            recommended_sip=tax_data["recommended_elss_sip"]
        )
        
        return {
            "status": "success",
            "tax_data": tax_data,
            "recommended_funds": top_elss,
            "ai_advice": ai_advice
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tax Saving Error: {str(e)}")
