import os
import json
from fastapi import APIRouter, Depends
from services.auth_service import get_current_user

router = APIRouter()

SAVED_PLANS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "saved_plans.json")

def load_saved_plans():
    if not os.path.exists(SAVED_PLANS_FILE):
        return []
    with open(SAVED_PLANS_FILE, "r") as f:
        return json.load(f)

@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    saved_plans = load_saved_plans()
    user_plans = [p for p in saved_plans if p.get("user_id") == current_user["user_id"]]
    
    tier = current_user.get("subscription_tier", "free")
    plans_used = current_user.get("plans_used_this_month", 0)
    limit = 3 if tier == "free" else -1
    
    return {
        "user_info": current_user,
        "usage": {
            "tier": tier,
            "plans_used": plans_used,
            "limit": limit
        },
        "saved_plans": user_plans,
        "total_saved": len(user_plans)
    }
