from fastapi import APIRouter, Depends, HTTPException
from database import supabase
from dependencies import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users(current_user=Depends(get_current_user)):
    """
    Return all registered users except the currently logged-in user.
    This is the real data used by Explore.
    """

    users_result = (
        supabase
        .table("users")
        .select("id, email, full_name")
        .execute()
    )

    users = users_result.data or []

    result = []

    for user in users:
        if str(user["id"]) == str(current_user["id"]):
            continue

        profile_result = (
            supabase
            .table("profiles")
            .select("*")
            .eq("user_id", user["id"])
            .execute()
        )

        profile = profile_result.data[0] if profile_result.data else {}

        result.append({
            "id": user["id"],
            "email": user.get("email"),
            "full_name": user.get("full_name"),
            "profile": profile,
        })

    return {
        "users": result,
        "count": len(result)
    }