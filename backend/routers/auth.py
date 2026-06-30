from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
import uuid
from datetime import datetime, timedelta
from services.auth_service import (
    get_password_hash, verify_password, 
    create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from database.connection import get_db

router = APIRouter()

class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

@router.post("/signup", response_model=Token)
async def signup(user_data: UserSignup, db = Depends(get_db)):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    
    new_user = {
        "user_id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hashed_password,
        "subscription_tier": "free",
        "plans_used_this_month": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    await db.users.insert_one(new_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id}, expires_delta=access_token_expires
    )
    
    user_info = {k: v for k, v in new_user.items() if k not in ["password_hash", "_id"]}
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_info}

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db = Depends(get_db)):
    user = await db.users.find_one({"email": user_data.email})
    
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["user_id"]}, expires_delta=access_token_expires
    )
    
    user_info = {k: v for k, v in user.items() if k not in ["password_hash", "_id"]}
    
    return {"access_token": access_token, "token_type": "bearer", "user": user_info}

@router.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    user_info = {k: v for k, v in current_user.items() if k not in ["password_hash", "_id"]}
    return user_info
