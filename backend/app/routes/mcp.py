
from fastapi import APIRouter, Query, HTTPException
from typing import List
from backend.app.models import PlayerProfile
from backend.app.services.linkedin_agent import search_golfers, send_linkedin_invitation

router = APIRouter()

@router.get("/search-players", response_model=List[PlayerProfile])
def search_players_nearby(location: str = Query(...)):
    results = search_golfers(location)
    return [PlayerProfile(**p) for p in results]

@router.post("/send-invitation")
def send_invitation(linkedin_member_id: str, message: str):
    if send_linkedin_invitation(linkedin_member_id, message):
        return {"status": "sent", "to": linkedin_member_id}
    raise HTTPException(status_code=500, detail="Failed to send invitation")
