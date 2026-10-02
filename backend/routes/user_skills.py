from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import supabase
from dependencies import get_current_user


router = APIRouter(
    prefix="/user-skills",
    tags=["User Skills"]
)


class UserSkillRequest(BaseModel):
    skill_id: str
    skill_type: str
    proficiency: str | None = None


@router.post("/")
def add_user_skill(
    data: UserSkillRequest,
    current_user=Depends(get_current_user)
):

    if data.skill_type not in ["teach", "learn"]:
        raise HTTPException(
            status_code=400,
            detail="skill_type must be 'teach' or 'learn'"
        )

    skill = (
        supabase
        .table("skills")
        .select("id, name, category, description")
        .eq("id", data.skill_id)
        .execute()
    )

    if not skill.data:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    existing = (
        supabase
        .table("user_skills")
        .select("*")
        .eq("user_id", current_user["id"])
        .eq("skill_id", data.skill_id)
        .eq("skill_type", data.skill_type)
        .execute()
    )

    if existing.data:
        return {
            "message": "Skill already added",
            "user_skill": existing.data[0]
        }

    result = (
        supabase
        .table("user_skills")
        .insert({
            "user_id": current_user["id"],
            "skill_id": data.skill_id,
            "skill_type": data.skill_type,
            "proficiency": data.proficiency
        })
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Could not add skill"
        )

    return {
        "message": "Skill added successfully",
        "user_skill": result.data[0],
        "skill": skill.data[0]
    }


@router.get("/")
def get_my_skills(
    current_user=Depends(get_current_user)
):

    result = (
        supabase
        .table("user_skills")
        .select("id, skill_id, skill_type, proficiency, skills(id, name, category, description)")
        .eq("user_id", current_user["id"])
        .execute()
    )

    return {
        "skills": result.data
    }