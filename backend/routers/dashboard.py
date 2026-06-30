from fastapi import APIRouter, Depends
from services.auth_service import get_current_user
from database.connection import get_db

router = APIRouter()

@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    # Fetch saved plans for this user from MongoDB
    cursor = db.saved_plans.find({"user_id": current_user["user_id"]})
    user_plans = await cursor.to_list(length=100)
    
    # Convert _id to string for JSON serialization
    for plan in user_plans:
        plan["_id"] = str(plan["_id"])
    
    tier = current_user.get("subscription_tier", "free")
    plans_used = current_user.get("plans_used_this_month", 0)
    limit = 3 if tier == "free" else -1
    is_unlimited = (tier != "free")
    
    return {
        "user_info": current_user,
        "usage": {
            "tier": tier,
            "plans_used": plans_used,
            "limit": limit,
            "is_unlimited": is_unlimited
        },
        "saved_plans": user_plans,
        "total_saved": len(user_plans)
    }
