from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

from services.portfolio_service import (
    calculate_portfolio_performance, 
    get_portfolio_health, 
    generate_portfolio_insight,
    load_portfolios,
    save_portfolios
)

router = APIRouter()

class FundEntry(BaseModel):
    scheme_code: str
    fund_name: str
    monthly_sip: int
    start_date: str
    total_invested: Optional[float] = None

class TrackPortfolioRequest(BaseModel):
    user_name: str = ""
    email: str
    funds: List[FundEntry]
    risk_score: float = 5.0

@router.post("/track")
async def track_portfolio(req: TrackPortfolioRequest):
    if not req.funds:
        raise HTTPException(status_code=400, detail="Funds list cannot be empty")
        
    funds_list = [f.model_dump() for f in req.funds]
    
    # 1. Calculate basic performance
    perf_data = await calculate_portfolio_performance(funds_list)
    
    # 2. Calculate health score
    health_data = get_portfolio_health(perf_data["funds_performance"], req.risk_score)
    perf_data["health_score"] = health_data["score"]
    perf_data["rebalancing_needed"] = health_data["rebalancing_needed"]
    perf_data["rebalancing_suggestions"] = health_data["rebalancing_suggestions"]
    
    # 3. Generate AI Insight
    ai_insight = generate_portfolio_insight(perf_data)
    perf_data["ai_insight"] = ai_insight
    
    # 4. Save to JSON
    data = load_portfolios()
    
    # Check if user already exists
    found = False
    for p in data["portfolios"]:
        if p["email"] == req.email:
            p["user_name"] = req.user_name
            p["funds"] = funds_list
            p["risk_score"] = req.risk_score
            p["last_updated"] = datetime.now().isoformat()
            p["summary"] = perf_data
            found = True
            break
            
    if not found:
        data["portfolios"].append({
            "user_name": req.user_name,
            "email": req.email,
            "funds": funds_list,
            "risk_score": req.risk_score,
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "summary": perf_data
        })
        
    save_portfolios(data)
    
    return perf_data

@router.get("/summary")
async def get_portfolio_summary(email: str = Query(..., description="User's email")):
    data = load_portfolios()
    for p in data["portfolios"]:
        if p["email"] == email:
            return p["summary"]
    raise HTTPException(status_code=404, detail="Portfolio not found for this email")

@router.get("/rebalance")
async def get_rebalance_recommendations(email: str = Query(..., description="User's email")):
    data = load_portfolios()
    for p in data["portfolios"]:
        if p["email"] == email:
            summary = p["summary"]
            return {
                "rebalancing_needed": summary.get("rebalancing_needed", False),
                "suggestions": summary.get("rebalancing_suggestions", [])
            }
    raise HTTPException(status_code=404, detail="Portfolio not found for this email")
