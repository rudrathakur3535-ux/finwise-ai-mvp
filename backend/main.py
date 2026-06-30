import sys
import io

# Windows pe Hindi/emoji characters ke liye UTF-8 set karo
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Apna advisor router import karo
from routes.advisor import router as advisor_router
from routers.reminders import router as reminders_router
from routers.portfolio import router as portfolio_router
from routers.auth import router as auth_router
from routers.subscription import router as subscription_router
from routers.dashboard import router as dashboard_router
from services.reminder_service import check_and_send_reminders
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager

scheduler = BackgroundScheduler()

from database.connection import db_instance

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to DB and start scheduler
    await db_instance.connect_db()
    
    scheduler.add_job(check_and_send_reminders, 'cron', hour=9, minute=0)
    scheduler.start()
    print("APScheduler started: Daily SIP reminders scheduled for 9:00 AM.")
    yield
    # Shutdown
    scheduler.shutdown()
    await db_instance.close_db()

app = FastAPI(
    title="FinWise AI API",
    description="🧠 AI-Powered Financial Investment Advisor",
    version="1.0.0",
    lifespan=lifespan
)

# CORS — Frontend (Next.js) aur Vercel se requests allow karo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Hackathon production ke liye sab allow kar do
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers attach karo
app.include_router(advisor_router)
app.include_router(reminders_router, prefix="/api/reminders", tags=["Reminders"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(subscription_router, prefix="/api/subscription", tags=["Subscription"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/health")
def health():
    return {
        "status": "FinWise AI Backend is running!",
        "version": "1.0.0",
        "endpoints": [
            "GET  /health     → Server status",
            "POST /api/advice → Get AI financial advice",
        ]
    }