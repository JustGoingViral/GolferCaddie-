
from fastapi import APIRouter, Query
from typing import List
from backend.app.models import PlayerProfile, SponsorOffer
from backend.app.services.sponsor_match import match_sponsors

router = APIRouter()

@router.post("/match", response_model=List[SponsorOffer])
def sponsor_match(player: PlayerProfile):
    offers = match_sponsors(player)
    return [SponsorOffer(**o) for o in offers]
