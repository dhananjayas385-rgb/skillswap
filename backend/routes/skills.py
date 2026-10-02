from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import supabase
from dependencies import get_current_user


router = APIRouter(
    prefix="/skills",
    tags=["Skills"]
)


class SkillRequest(BaseModel):
    name: str
    category: str | None = None
    description: str | None = None


@router.post("/")
def create_skill(
    data: SkillRequest,
    current_user=Depends(get_current_user)
):

    existing = (
        supabase
        .table("skills")
        .select("*")
        .eq("name", data.name)
        .execute()
    )

    if existing.data:
        return {
            "message": "Skill already exists",
            "skill": existing.data[0]
        }

    result = (
        supabase
        .table("skills")
        .insert({
            "name": data.name,
            "category": data.category,
            "description": data.description
        })
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Could not create skill"
        )

    return {
        "message": "Skill created successfully",
        "skill": result.data[0]
    }


@router.get("/search")
def search_skills(
    q: str,
    current_user=Depends(get_current_user)
):

    result = (
        supabase
        .table("skills")
        .select("*")
        .ilike("name", f"%{q}%")
        .order("name")
        .limit(20)
        .execute()
    )

    return {
        "skills": result.data
    }