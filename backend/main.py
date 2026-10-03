from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.profiles import router as profiles_router
from routes.skills import router as skills_router
from routes.user_skills import router as user_skills_router
from routes.exchange_requests import router as exchange_requests_router
from routes.app_state import router as app_state_router


app = FastAPI(
    title="SkillSwap API",
    description="Backend API for SkillSwap",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://skillswap-9bnz.onrender.com",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "SkillSwap API is running",
        "status": "online"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(skills_router)
app.include_router(user_skills_router)
app.include_router(exchange_requests_router)
app.include_router(app_state_router)