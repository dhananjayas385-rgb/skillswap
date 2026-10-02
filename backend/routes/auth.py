from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
import os
from jose import jwt
from dotenv import load_dotenv

from database import supabase

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not JWT_SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not configured")

ALGORITHM = "HS256"

def create_access_token(user_id: str):
    payload = {
        "sub": user_id
    }

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=ALGORITHM
    )

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register_user(data: RegisterRequest):

    existing_user = (
        supabase
        .table("users")
        .select("id")
        .eq("email", data.email)
        .execute()
    )

    if existing_user.data:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    password_hash = pwd_context.hash(data.password)

    result = (
        supabase
        .table("users")
        .insert({
            "email": data.email,
            "password_hash": password_hash,
            "full_name": data.full_name
        })
        .execute()
    )

    return {
        "message": "User registered successfully",
        "user": result.data[0]
    }
@router.post("/login")
def login_user(data: LoginRequest):

    result = (
        supabase
        .table("users")
        .select("*")
        .eq("email", data.email)
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    user = result.data[0]

    if not pwd_context.verify(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(user["id"])

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"]
            }
            }