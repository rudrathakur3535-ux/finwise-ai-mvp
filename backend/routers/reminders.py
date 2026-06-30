from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List
from services.reminder_service import add_reminder, get_reminder
from database.connection import get_db

router = APIRouter()

class FundItem(BaseModel):
    fund_name: str
    monthly_sip: int

class ReminderRequest(BaseModel):
    user_name: str = ""
    email: str
    sip_date: int
    funds: List[FundItem]

@router.post("/set")
async def set_reminder(req: ReminderRequest, db = Depends(get_db)):
    if req.sip_date < 1 or req.sip_date > 28:
        raise HTTPException(status_code=400, detail="SIP date must be between 1 and 28")
        
    next_date = await add_reminder(
        req.user_name, 
        req.email, 
        req.sip_date, 
        [f.model_dump() for f in req.funds],
        db
    )
    
    return {
        "status": "success",
        "next_reminder": next_date.isoformat(),
        "message": "Reminder set successfully"
    }

@router.get("/next")
async def get_next_reminder(email: str = Query(..., description="User's email"), db = Depends(get_db)):
    reminder_data = await get_reminder(email, db)
    if not reminder_data:
        raise HTTPException(status_code=404, detail="No reminder found for this email")
        
    days = reminder_data["days_until"]
    return {
        "days_until_sip": days,
        "sip_date": reminder_data["reminder"]["sip_date"],
        "total_monthly_sip": reminder_data["total_sip"],
        "funds": reminder_data["reminder"]["funds"],
        "message": f"Aapka SIP {days} din baad hai!" if days > 0 else "Aapka SIP aaj hai!" if days == 0 else "SIP date passed"
    }
