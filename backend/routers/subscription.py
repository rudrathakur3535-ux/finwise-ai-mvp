from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from services.auth_service import get_current_user
from database.connection import get_db

router = APIRouter()

class UpgradeRequest(BaseModel):
    tier: str  # "pro" or "premium"

@router.post("/upgrade")
async def upgrade_subscription(req: UpgradeRequest, current_user: dict = Depends(get_current_user), db = Depends(get_db)):
    if req.tier not in ["pro", "premium"]:
        raise HTTPException(status_code=400, detail="Invalid tier")
        
    await db.users.update_one(
        {"user_id": current_user["user_id"]},
        {"$set": {"subscription_tier": req.tier}}
    )
            
    return {"status": "success", "message": f"Successfully upgraded to {req.tier}", "new_tier": req.tier}

@router.get("/usage")
async def get_usage(current_user: dict = Depends(get_current_user)):
    tier = current_user.get("subscription_tier", "free")
    plans_used = current_user.get("plans_used_this_month", 0)
    
    limit = 3 if tier == "free" else -1  # -1 means unlimited
    
    return {
        "tier": tier,
        "plans_used": plans_used,
        "limit": limit,
        "is_unlimited": limit == -1
    }
