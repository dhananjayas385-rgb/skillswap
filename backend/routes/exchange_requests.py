from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from database import supabase
from dependencies import get_current_user


router = APIRouter(
    prefix="/exchange-requests",
    tags=["Exchange Requests"]
)


class ExchangeRequestCreate(BaseModel):
    receiver_id: str
    offered_skill_id: str
    requested_skill_id: str
    offered_skill_name: str | None = None
    requested_skill_name: str | None = None
    message: str | None = None


def resolve_skill(skill_id: str, skill_name: str | None = None):
    """
    Resolve a frontend skill to the real Supabase skills table.
    First try the ID. If that fails, try the skill name.
    """

    result = (
        supabase
        .table("skills")
        .select("id, name, category")
        .eq("id", skill_id)
        .execute()
    )

    if result.data:
        return result.data[0]

    if skill_name:
        result = (
            supabase
            .table("skills")
            .select("id, name, category")
            .ilike("name", skill_name.strip())
            .limit(1)
            .execute()
        )

        if result.data:
            return result.data[0]

    return None


@router.post("/")
def create_exchange_request(
    data: ExchangeRequestCreate,
    current_user=Depends(get_current_user)
):

    if data.receiver_id == current_user["id"]:
        raise HTTPException(
            status_code=400,
            detail="You cannot send an exchange request to yourself"
        )

    # ---------------------------------------------------------
    # CHECK RECEIVER
    # ---------------------------------------------------------

    receiver = (
        supabase
        .table("users")
        .select("id, full_name, email")
        .eq("id", data.receiver_id)
        .execute()
    )

    if not receiver.data:
        raise HTTPException(
            status_code=404,
            detail="Receiver not found"
        )

    # ---------------------------------------------------------
    # RESOLVE OFFERED SKILL
    # ---------------------------------------------------------

    offered_skill = resolve_skill(
        data.offered_skill_id,
        data.offered_skill_name
    )

    if not offered_skill:
        raise HTTPException(
            status_code=404,
            detail=f"Offered skill '{data.offered_skill_name or data.offered_skill_id}' not found"
        )

    # ---------------------------------------------------------
    # RESOLVE REQUESTED SKILL
    # ---------------------------------------------------------

    requested_skill = resolve_skill(
        data.requested_skill_id,
        data.requested_skill_name
    )

    if not requested_skill:
        raise HTTPException(
            status_code=404,
            detail=f"Requested skill '{data.requested_skill_name or data.requested_skill_id}' not found"
        )

    offered_skill_id = offered_skill["id"]
    requested_skill_id = requested_skill["id"]

    # ---------------------------------------------------------
    # CHECK SENDER TEACHES OFFERED SKILL
    # ---------------------------------------------------------

    sender_skill = (
        supabase
        .table("user_skills")
        .select("id")
        .eq("user_id", current_user["id"])
        .eq("skill_id", offered_skill_id)
        .eq("skill_type", "teach")
        .execute()
    )

    if not sender_skill.data:
        raise HTTPException(
            status_code=400,
            detail=f"You must have '{offered_skill['name']}' as a teaching skill"
        )

    # ---------------------------------------------------------
    # CHECK RECEIVER TEACHES REQUESTED SKILL
    #
    # This is the important correction.
    # You are asking KL Rahul to teach you this skill.
    # Therefore KL Rahul must teach it.
    # ---------------------------------------------------------

    receiver_skill = (
        supabase
        .table("user_skills")
        .select("id")
        .eq("user_id", data.receiver_id)
        .eq("skill_id", requested_skill_id)
        .eq("skill_type", "teach")
        .execute()
    )

    if not receiver_skill.data:
        raise HTTPException(
            status_code=400,
            detail=f"The receiver does not teach '{requested_skill['name']}'"
        )

    # ---------------------------------------------------------
    # PREVENT DUPLICATE PENDING REQUEST
    # ---------------------------------------------------------

    existing = (
        supabase
        .table("exchange_requests")
        .select("id")
        .eq("sender_id", current_user["id"])
        .eq("receiver_id", data.receiver_id)
        .eq("status", "pending")
        .eq("requested_skill_id", requested_skill_id)
        .eq("offered_skill_id", offered_skill_id)
        .limit(1)
        .execute()
    )

    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="You already have a pending request with this student"
        )

    # ---------------------------------------------------------
    # CREATE REQUEST
    # ---------------------------------------------------------

    result = (
        supabase
        .table("exchange_requests")
        .insert({
            "sender_id": current_user["id"],
            "receiver_id": data.receiver_id,
            "offered_skill_id": offered_skill_id,
            "requested_skill_id": requested_skill_id,
            "message": data.message,
            "status": "pending"
        })
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=500,
            detail="Could not create exchange request"
        )

    return {
        "message": "Exchange request sent successfully",
        "request": result.data[0]
    }


# =============================================================
# GET MY REQUESTS
# =============================================================

@router.get("/")
def get_my_exchange_requests(
    current_user=Depends(get_current_user)
):

    sent = (
        supabase
        .table("exchange_requests")
        .select("*")
        .eq("sender_id", current_user["id"])
        .order("created_at", desc=True)
        .execute()
    )

    received = (
        supabase
        .table("exchange_requests")
        .select("*")
        .eq("receiver_id", current_user["id"])
        .order("created_at", desc=True)
        .execute()
    )

    return {
        "sent": sent.data or [],
        "received": received.data or []
    }


# =============================================================
# ACCEPT
# =============================================================

@router.patch("/{request_id}/accept")
def accept_exchange_request(
    request_id: str,
    current_user=Depends(get_current_user)
):

    request = (
        supabase
        .table("exchange_requests")
        .select("*")
        .eq("id", request_id)
        .eq("receiver_id", current_user["id"])
        .execute()
    )

    if not request.data:
        raise HTTPException(
            status_code=404,
            detail="Exchange request not found"
        )

    exchange_request = request.data[0]

    if exchange_request["status"] != "pending":
        raise HTTPException(
            status_code=400,
            detail="This request is no longer pending"
        )

    updated = (
        supabase
        .table("exchange_requests")
        .update({
            "status": "accepted"
        })
        .eq("id", request_id)
        .execute()
    )

    if not updated.data:
        raise HTTPException(
            status_code=500,
            detail="Could not accept exchange request"
        )

    return {
        "message": "Exchange request accepted successfully",
        "request": updated.data[0]
    }


# =============================================================
# REJECT
# =============================================================

@router.patch("/{request_id}/reject")
def reject_exchange_request(
    request_id: str,
    current_user=Depends(get_current_user)
):

    request = (
        supabase
        .table("exchange_requests")
        .select("*")
        .eq("id", request_id)
        .eq("receiver_id", current_user["id"])
        .execute()
    )

    if not request.data:
        raise HTTPException(
            status_code=404,
            detail="Exchange request not found"
        )

    exchange_request = request.data[0]

    if exchange_request["status"] != "pending":
        raise HTTPException(
            status_code=400,
            detail="This request is no longer pending"
        )

    updated = (
        supabase
        .table("exchange_requests")
        .update({
            "status": "rejected"
        })
        .eq("id", request_id)
        .execute()
    )

    if not updated.data:
        raise HTTPException(
            status_code=500,
            detail="Could not reject exchange request"
        )

    return {
        "message": "Exchange request rejected",
        "request": updated.data[0]
    }