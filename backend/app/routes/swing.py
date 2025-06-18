
from fastapi import APIRouter, HTTPException, Body
from typing import Optional, Dict, Any
from backend.app.models import SwingAnalysis, MediaUpload
from backend.app.services.swing_analysis import analyze_swing

router = APIRouter()

@router.post("/analyze", response_model=SwingAnalysis)
def swing_analysis(
    video_url: str = Body(..., description="URL of the swing video to analyze"),
    metadata: Optional[Dict[str, Any]] = Body(None, description="Additional context about the swing video"),
    player_id: Optional[str] = Body(None, description="Player ID for personalized analysis")
):
    """
    Analyze a golf swing video using AI and provide comprehensive feedback
    """
    try:
        result = analyze_swing(video_url, metadata)
        return SwingAnalysis(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing swing: {str(e)}")

@router.post("/upload-and-analyze", response_model=SwingAnalysis)
def upload_and_analyze_swing(media_upload: MediaUpload):
    """
    Upload a swing video and perform immediate analysis
    """
    try:
        # Process the media upload
        result = analyze_swing(
            video_url=media_upload.video_url,
            metadata=media_upload.metadata
        )
        return SwingAnalysis(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video upload: {str(e)}")

@router.get("/analysis-history/{player_id}")
def get_analysis_history(player_id: str, limit: int = 10):
    """
    Get swing analysis history for a player
    """
    # Mock data - in production this would come from a database
    return {
        "player_id": player_id,
        "total_analyses": 25,
        "recent_analyses": [
            {
                "analysis_id": "ana_001",
                "date": "2024-01-15",
                "overall_rating": 78.5,
                "primary_focus": "tempo_improvement",
                "video_url": "https://example.com/video1.mp4"
            },
            {
                "analysis_id": "ana_002", 
                "date": "2024-01-10",
                "overall_rating": 76.2,
                "primary_focus": "balance_work",
                "video_url": "https://example.com/video2.mp4"
            }
        ],
        "improvement_trend": "positive",
        "avg_rating_last_30_days": 77.3
    }

@router.get("/compare-swings")
def compare_swings(
    video_url_1: str,
    video_url_2: str,
    comparison_focus: Optional[str] = "overall"
):
    """
    Compare two swing videos side by side
    """
    try:
        # Analyze both swings
        analysis_1 = analyze_swing(video_url_1)
        analysis_2 = analyze_swing(video_url_2)
        
        # Generate comparison insights
        comparison = {
            "swing_1": analysis_1,
            "swing_2": analysis_2,
            "comparison_insights": {
                "rating_difference": analysis_2.get("overall_rating", 75) - analysis_1.get("overall_rating", 75),
                "improved_areas": [],
                "declined_areas": [],
                "key_differences": []
            }
        }
        
        # Compare mechanics breakdown if available
        if analysis_1.get("mechanics_breakdown") and analysis_2.get("mechanics_breakdown"):
            mechanics_1 = analysis_1["mechanics_breakdown"]
            mechanics_2 = analysis_2["mechanics_breakdown"]
            
            for category in mechanics_1.keys():
                if category in mechanics_2:
                    diff = mechanics_2[category] - mechanics_1[category]
                    if diff > 5:
                        comparison["comparison_insights"]["improved_areas"].append(category)
                    elif diff < -5:
                        comparison["comparison_insights"]["declined_areas"].append(category)
        
        return comparison
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error comparing swings: {str(e)}")

@router.get("/pro-swing-library")
def get_pro_swing_library(category: Optional[str] = None):
    """
    Get library of professional golfer swing videos for comparison
    """
    pro_swings = {
        "drivers": [
            {
                "golfer": "Rory McIlroy",
                "video_url": "https://example.com/rory_driver.mp4",
                "key_features": ["explosive hip rotation", "maintained spine angle"],
                "swing_speed": "118 mph"
            },
            {
                "golfer": "Dustin Johnson", 
                "video_url": "https://example.com/dj_driver.mp4",
                "key_features": ["long backswing", "natural release"],
                "swing_speed": "121 mph"
            }
        ],
        "irons": [
            {
                "golfer": "Justin Thomas",
                "video_url": "https://example.com/jt_iron.mp4", 
                "key_features": ["compact swing", "consistent tempo"],
                "accuracy": "85%"
            },
            {
                "golfer": "Jason Day",
                "video_url": "https://example.com/day_iron.mp4",
                "key_features": ["great balance", "smooth tempo"],
                "accuracy": "88%"
            }
        ],
        "wedges": [
            {
                "golfer": "Phil Mickelson",
                "video_url": "https://example.com/phil_wedge.mp4",
                "key_features": ["soft hands", "creative shots"],
                "short_game_ranking": "#1"
            }
        ]
    }
    
    if category and category in pro_swings:
        return {category: pro_swings[category]}
    
    return pro_swings
