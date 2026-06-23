import sys
import io

# Windows pe Hindi/emoji characters ke liye UTF-8 set karo
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Apna advisor router import karo
from routes.advisor import router as advisor_router

app = FastAPI(
    title="FinWise AI API",
    description="🧠 AI-Powered Financial Investment Advisor",
    version="1.0.0"
)

# CORS — Frontend (Next.js) aur Vercel se requests allow karo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Hackathon production ke liye sab allow kar do
    allow_methods=["*"],
    allow_headers=["*"],
)

# Advisor router attach karo
app.include_router(advisor_router)


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