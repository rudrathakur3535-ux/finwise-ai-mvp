from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserDB(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    password_hash: str
    subscription_tier: str = "free"
    plans_used_this_month: int = 0
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    last_login: Optional[str] = None
    is_verified: bool = False

class SavedPlanDB(BaseModel):
    user_id: str
    date: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    profile_name: str
    plan_data: Dict[str, Any]

class PortfolioDB(BaseModel):
    user_id: Optional[str] = None
    user_name: str
    email: str
    funds: List[Dict[str, Any]]
    risk_score: float
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    summary: Dict[str, Any]

class ReminderDB(BaseModel):
    user_name: str
    email: str
    sip_date: int
    funds: List[Dict[str, Any]]
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: Optional[str] = None
    active: bool = True
