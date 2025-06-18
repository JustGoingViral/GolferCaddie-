
from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from backend.app.models import ShotRecommendation
from backend.app.services.ai_caddie import get_ai_shot_recommendation

router = APIRouter()

@router.get("/recommend-shot", response_model=ShotRecommendation)
def recommend_shot(
    hole: int = Query(..., description="Hole number (1-18)"),
    distance: int = Query(..., description="Distance to target in yards"),
    wind_speed: float = Query(0, description="Wind speed in mph"),
    wind_direction: str = Query("none", description="Wind direction (headwind, tailwind, crosswind, etc.)"),
    lie: str = Query("fairway", description="Ball lie (fairway, rough, sand, tee, etc.)"),
    elevation: int = Query(0, description="Elevation change in feet (positive for uphill)"),
    past_club: str = Query("7 iron", description="Previously used club"),
    skill_level: str = Query("Amateur", description="Player skill level"),
):
    """
    Get AI-powered shot recommendation based on course conditions and player profile
    """
    try:
        data = get_ai_shot_recommendation(
            hole=hole,
            distance=distance,
            wind_speed=wind_speed,
            wind_direction=wind_direction,
            lie=lie,
            elevation=elevation,
            past_club=past_club,
            skill_level=skill_level
        )
        return ShotRecommendation(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating shot recommendation: {str(e)}")

@router.get("/course-conditions")
def get_course_conditions():
    """
    Get current course conditions (could be integrated with weather APIs)
    """
    # In production, this would integrate with weather services
    return {
        "wind_speed": 8,
        "wind_direction": "left to right",
        "temperature": 72,
        "humidity": 65,
        "course_conditions": "Firm and fast",
        "pin_positions": "Mixed - some tough, some accessible"
    }

@router.get("/player-stats/{player_id}")
def get_player_stats(player_id: str):
    """
    Get player's historical performance stats for better recommendations
    """
    # Mock data - in production this would come from a database
    return {
        "player_id": player_id,
        "average_distances": {
            "Driver": 245,
            "3 Wood": 220,
            "5 Iron": 170,
            "7 Iron": 150,
            "9 Iron": 130,
            "PW": 115
        },
        "accuracy_stats": {
            "fairways_hit": 65,
            "greens_in_regulation": 58,
            "average_putts": 1.8
        },
        "recent_performance": {
            "last_5_rounds": [78, 82, 76, 80, 79],
            "trending": "stable"
        }
    }
