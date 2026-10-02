from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from database import supabase
from dependencies import get_current_user
from routes.auth import router as auth_router
from routes.profiles import router as profiles_router
from routes.skills import router as skills_router
from routes.user_skills import router as user_skills_router
from routes.exchange_requests import router as exchange_requests_router


app = FastAPI(
    title="SkillSwap API",
    description="Backend API for SkillSwap",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes
app.include_router(auth_router)

# Profile routes
app.include_router(profiles_router)

# Skills routes
app.include_router(skills_router)

# User Skills routes
app.include_router(user_skills_router)

# Exchange Request routes
app.include_router(exchange_requests_router)


# Root route
@app.get("/")
def root():
    return {
        "message": "SkillSwap API is running"
    }


# Health check
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# Database connection test
@app.get("/database-test")
def database_test():
    result = (
        supabase
        .table("users")
        .select("id")
        .limit(1)
        .execute()
    )

    return {
        "status": "connected",
        "users_found": len(result.data)
    }


# Current logged-in user
@app.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "message": "Authenticated successfully",
        "user": current_user
    }