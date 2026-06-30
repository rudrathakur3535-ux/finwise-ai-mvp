from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from services.auth_service import get_current_user, load_users, save_users

router = APIRouter()

class UpgradeRequest(BaseModel):
    tier: str  # "pro" or "premium"

@router.post("/upgrade")
async def upgrade_subscription(req: UpgradeRequest, current_user: dict = Depends(get_current_user)):
    if req.tier not in ["pro", "premium"]:
        raise HTTPException(status_code=400, detail="Invalid tier")
        
    users = load_users()
    for u in users:
        if u["user_id"] == current_user["user_id"]:
            u["subscription_tier"] = req.tier
            break
            
    save_users(users)
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
