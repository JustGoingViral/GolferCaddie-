
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class PlayerProfile(BaseModel):
    id: str
    name: str
    headline: Optional[str] = None
    location: Optional[str] = None
    linkedin_url: Optional[str] = None
    skill_level: Optional[str] = "Amateur"  # e.g. 'Beginner', 'Amateur', 'Intermediate', 'Advanced', 'Pro'
    interests: Optional[List[str]] = []
    handicap: Optional[float] = None
    favorite_courses: Optional[List[str]] = []
    equipment_preferences: Optional[Dict[str, str]] = {}

class AlternativeClub(BaseModel):
    club: str
    distance: int
    strategy: str
    difference: int

class ShotRecommendation(BaseModel):
    club: str
    suggestion: str
    tip: str
    wind: Optional[str] = None
    yardage: Optional[int] = None
    effective_yardage: Optional[int] = None
    expected_outcome: Optional[str] = None
    ai_explanation: Optional[str] = None
    alternatives: Optional[List[AlternativeClub]] = []
    confidence: Optional[int] = None

class SwingFault(BaseModel):
    fault: str
    severity: str
    description: str
    fixes: List[str]

class ProComparison(BaseModel):
    name: str
    match_percentage: int
    style: str
    key_traits: List[str]
    specialty: str

class ImprovementPlan(BaseModel):
    priorities: List[str]
    recommended_drills: List[str]
    practice_frequency: str
    focus_areas: List[str]

class SwingAnalysis(BaseModel):
    summary: str
    video_url: Optional[str] = None
    match_golfer: Optional[str] = None
    match_percentage: Optional[int] = None
    advice: Optional[str] = None
    overall_rating: Optional[float] = None
    mechanics_breakdown: Optional[Dict[str, int]] = None
    identified_faults: Optional[List[SwingFault]] = []
    improvement_plan: Optional[ImprovementPlan] = None
    pro_comparison: Optional[ProComparison] = None
    analysis_timestamp: Optional[str] = None
    video_context: Optional[Dict[str, str]] = {}

class SponsorOffer(BaseModel):
    sponsor_name: str
    offer_text: str
    url: Optional[str] = None
    amount: Optional[str] = None
    offer_type: Optional[str] = None  # e.g., 'equipment', 'apparel', 'lessons'
    expiry_date: Optional[str] = None
    terms: Optional[str] = None

class MediaUpload(BaseModel):
    player_id: str
    video_url: str
    timestamp: Optional[str] = None
    voice_tag: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}
    analysis_requested: Optional[bool] = True

class CourseConditions(BaseModel):
    wind_speed: float
    wind_direction: str
    temperature: int
    humidity: int
    course_conditions: str
    pin_positions: str

class PlayerStats(BaseModel):
    player_id: str
    average_distances: Dict[str, int]
    accuracy_stats: Dict[str, float]
    recent_performance: Dict[str, Any]
    handicap_trend: Optional[List[float]] = []
    strengths: Optional[List[str]] = []
    weaknesses: Optional[List[str]] = []

class GolfRound(BaseModel):
    round_id: str
    player_id: str
    course_name: str
    date: str
    total_score: int
    holes_played: int
    weather_conditions: Optional[CourseConditions] = None
    hole_scores: Optional[List[Dict[str, Any]]] = []
    statistics: Optional[Dict[str, Any]] = {}

class AIInsight(BaseModel):
    insight_type: str  # e.g., 'performance_trend', 'improvement_suggestion', 'course_strategy'
    title: str
    description: str
    confidence: float
    supporting_data: Optional[Dict[str, Any]] = {}
    recommendations: Optional[List[str]] = []
    priority: Optional[str] = "medium"  # low, medium, high
