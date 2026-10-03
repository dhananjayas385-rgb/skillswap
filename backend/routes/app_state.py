from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import supabase
from dependencies import get_current_user

router = APIRouter(prefix="/app-state", tags=["App State"])


class AppStateRequest(BaseModel):
    state: dict[str, Any]


@router.get("/")
def get_app_state(current_user=Depends(get_current_user)):
    result = (
        supabase
        .table("app_states")
        .select("state, updated_at")
        .eq("user_id", current_user["id"])
        .execute()
    )

    if not result.data:
        return {
            "state": None,
            "updated_at": None
        }

    return result.data[0]


@router.put("/")
def save_app_state(
    data: AppStateRequest,
    current_user=Depends(get_current_user)
):
    result = (
        supabase
        .table("app_states")
        .upsert(
            {
                "user_id": current_user["id"],
                "state": data.state
            },
            on_conflict="user_id"
        )
        .select("state, updated_at")
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Could not save application state"
        )

    return result.data[0]