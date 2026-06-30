from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from services.portfolio_service import (
    calculate_portfolio_performance, 
    get_portfolio_health, 
    generate_portfolio_insight
)
from database.connection import get_db

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
async def track_portfolio(req: TrackPortfolioRequest, db = Depends(get_db)):
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
    
    # 4. Save to MongoDB
    existing_portfolio = await db.portfolios.find_one({"email": req.email})
    
    if existing_portfolio:
        await db.portfolios.update_one(
            {"email": req.email},
            {"$set": {
                "user_name": req.user_name,
                "funds": funds_list,
                "risk_score": req.risk_score,
                "last_updated": datetime.utcnow().isoformat(),
                "summary": perf_data
            }}
        )
    else:
        await db.portfolios.insert_one({
            "user_name": req.user_name,
            "email": req.email,
            "funds": funds_list,
            "risk_score": req.risk_score,
            "created_at": datetime.utcnow().isoformat(),
            "last_updated": datetime.utcnow().isoformat(),
            "summary": perf_data
        })
        
    return perf_data

@router.get("/summary")
async def get_portfolio_summary(email: str = Query(..., description="User's email"), db = Depends(get_db)):
    portfolio = await db.portfolios.find_one({"email": email})
    if portfolio:
        return portfolio.get("summary", {})
    raise HTTPException(status_code=404, detail="Portfolio not found for this email")

@router.get("/rebalance")
async def get_rebalance_recommendations(email: str = Query(..., description="User's email"), db = Depends(get_db)):
    portfolio = await db.portfolios.find_one({"email": email})
    if portfolio:
        summary = portfolio.get("summary", {})
        return {
            "rebalancing_needed": summary.get("rebalancing_needed", False),
            "suggestions": summary.get("rebalancing_suggestions", [])
        }
    raise HTTPException(status_code=404, detail="Portfolio not found for this email")
