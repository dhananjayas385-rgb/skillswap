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
    message: str | None = None


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

    # Check receiver
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

    # Check offered skill
    offered_skill = (
        supabase
        .table("skills")
        .select("id, name, category")
        .eq("id", data.offered_skill_id)
        .execute()
    )

    if not offered_skill.data:
        raise HTTPException(
            status_code=404,
            detail="Offered skill not found"
        )

    # Check requested skill
    requested_skill = (
        supabase
        .table("skills")
        .select("id, name, category")
        .eq("id", data.requested_skill_id)
        .execute()
    )

    if not requested_skill.data:
        raise HTTPException(
            status_code=404,
            detail="Requested skill not found"
        )

    # Check if the sender actually teaches the offered skill
    sender_skill = (
        supabase
        .table("user_skills")
        .select("id")
        .eq("user_id", current_user["id"])
        .eq("skill_id", data.offered_skill_id)
        .eq("skill_type", "teach")
        .execute()
    )

    if not sender_skill.data:
        raise HTTPException(
            status_code=400,
            detail="You must have the offered skill as a teaching skill"
        )

    # Check if the sender actually wants to learn the requested skill
    learning_skill = (
        supabase
        .table("user_skills")
        .select("id")
        .eq("user_id", current_user["id"])
        .eq("skill_id", data.requested_skill_id)
        .eq("skill_type", "learn")
        .execute()
    )

    if not learning_skill.data:
        raise HTTPException(
            status_code=400,
            detail="You must have the requested skill as a learning skill"
        )

    # Create exchange request
    result = (
        supabase
        .table("exchange_requests")
        .insert({
            "sender_id": current_user["id"],
            "receiver_id": data.receiver_id,
            "offered_skill_id": data.offered_skill_id,
            "requested_skill_id": data.requested_skill_id,
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
        "sent": sent.data,
        "received": received.data
    }


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