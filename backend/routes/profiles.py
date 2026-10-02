from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import supabase
from dependencies import get_current_user


router = APIRouter(
    prefix="/profiles",
    tags=["Profiles"]
)


class ProfileRequest(BaseModel):
    college: str | None = None
    district: str | None = None
    city: str | None = None
    bio: str | None = None
    profile_image_url: str | None = None


@router.post("/")
def create_or_update_profile(
    data: ProfileRequest,
    current_user=Depends(get_current_user)
):

    existing = (
        supabase
        .table("profiles")
        .select("id")
        .eq("user_id", current_user["id"])
        .execute()
    )

    profile_data = {
        "user_id": current_user["id"],
        "college": data.college,
        "district": data.district,
        "city": data.city,
        "bio": data.bio,
        "profile_image_url": data.profile_image_url
    }

    if existing.data:
        result = (
            supabase
            .table("profiles")
            .update(profile_data)
            .eq("user_id", current_user["id"])
            .execute()
        )
    else:
        result = (
            supabase
            .table("profiles")
            .insert(profile_data)
            .execute()
        )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Could not save profile"
        )

    return {
        "message": "Profile saved successfully",
        "profile": result.data[0]
    }


@router.get("/")
def get_my_profile(
    current_user=Depends(get_current_user)
):

    result = (
        supabase
        .table("profiles")
        .select("*")
        .eq("user_id", current_user["id"])
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Profile not found"
        )

    return result.data[0]