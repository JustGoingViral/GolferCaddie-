
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import Dict, Optional
import json
from ..services.course_ai import get_real_time_strategy, get_enhanced_strategy, store_shot_result

router = APIRouter(prefix="/course-ai", tags=["Course AI"])

class StrategyRequest(BaseModel):
    weather_data: Dict
    player_data: Dict
    distance: int

class EnhancedStrategyRequest(BaseModel):
    course_id: str
    hole_number: int
    pin_position: Dict
    weather_data: Dict
    player_data: Dict
    distance: int
    player_id: str

class ShotResultRequest(BaseModel):
    player_id: str
    course_id: str
    hole_number: int
    shot_result: Dict
    
class StrategyResponse(BaseModel):
    strategy: Dict
    course_analysis: Dict
    confidence: float
    timestamp: str

@router.post("/analyze-shot", response_model=StrategyResponse)
async def analyze_shot_strategy(
    request: StrategyRequest,
    image: UploadFile = File(...)
):
    """
    Analyze shot strategy based on course image and conditions
    """
    try:
        # Read image data
        image_data = await image.read()
        
        # Get real-time strategy
        result = get_real_time_strategy(
            image_data=image_data,
            weather_data=request.weather_data,
            player_data=request.player_data,
            distance=request.distance
        )
        
        return StrategyResponse(
            strategy=result["strategy"],
            course_analysis=result["course_analysis"],
            confidence=result["confidence"],
            timestamp=result["timestamp"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.post("/analyze-enhanced-shot", response_model=StrategyResponse)
async def analyze_enhanced_shot_strategy(
    request: EnhancedStrategyRequest,
    image: UploadFile = File(...)
):
    """
    Enhanced shot analysis with satellite imagery and historical performance
    """
    try:
        # Read image data
        image_data = await image.read()
        
        # Get enhanced strategy with satellite and historical analysis
        result = get_enhanced_strategy(
            course_id=request.course_id,
            hole_number=request.hole_number,
            pin_position=request.pin_position,
            image_data=image_data,
            weather_data=request.weather_data,
            player_data=request.player_data,
            distance=request.distance,
            player_id=request.player_id
        )
        
        return StrategyResponse(
            strategy=result["strategy"],
            course_analysis=result["course_analysis"],
            confidence=result["confidence"],
            timestamp=result["timestamp"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhanced analysis failed: {str(e)}")

@router.post("/store-shot-result")
async def store_shot_performance(request: ShotResultRequest):
    """
    Store shot result for historical analysis
    """
    try:
        store_shot_result(
            player_id=request.player_id,
            course_id=request.course_id,
            hole_number=request.hole_number,
            shot_result=request.shot_result
        )
        
        return {"message": "Shot result stored successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store result: {str(e)}")

@router.get("/player-history/{player_id}/{course_id}/{hole_number}")
async def get_player_hole_history(player_id: str, course_id: str, hole_number: int):
    """
    Get player's historical performance on a specific hole
    """
    try:
        from ..services.course_ai import CourseStrategyAI
        ai = CourseStrategyAI()
        history = ai._get_player_history(player_id, course_id, hole_number)
        
        return {
            "player_id": player_id,
            "course_id": course_id,
            "hole_number": hole_number,
            "history": history
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get history: {str(e)}")

@router.get("/course-satellite/{course_id}/{hole_number}")
async def get_satellite_analysis(course_id: str, hole_number: int):
    """
    Get satellite imagery analysis for a specific hole
    """
    try:
        from ..services.course_ai import CourseStrategyAI
        ai = CourseStrategyAI()
        satellite_data = ai._get_satellite_imagery(course_id, hole_number)
        
        return {
            "course_id": course_id,
            "hole_number": hole_number,
            "satellite_analysis": satellite_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get satellite data: {str(e)}")

@router.get("/weather/{course_id}")
async def get_course_weather(course_id: str):
    """
    Get current weather conditions for a specific course
    """
    # Mock weather data - in production, integrate with weather API
    return {
        "temperature": 72,
        "humidity": 65,
        "wind_speed": 8,
        "wind_direction": "SW",
        "pressure": 30.12,
        "conditions": "partly_cloudy",
        "green_speed": "medium_fast"
    }
