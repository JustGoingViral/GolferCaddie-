from fastapi import APIRouter, HTTPException, Body
from typing import Optional, List, Dict
from pydantic import BaseModel
from backend.app.services.golf_chatbot import get_golf_chat_response

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    context: Optional[List[Dict]] = []
    player_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    conversation_id: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
def golf_chat(chat_message: ChatMessage):
    """
    Get AI-powered golf advice and answers through chat interface
    """
    try:
        from datetime import datetime
        
        response_text = get_golf_chat_response(
            message=chat_message.message,
            context=chat_message.context
        )
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now().isoformat(),
            conversation_id=f"conv_{chat_message.player_id or 'guest'}_{int(datetime.now().timestamp())}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat message: {str(e)}")

@router.get("/golf-tips")
def get_daily_golf_tips():
    """
    Get daily golf tips and insights
    """
    import random
    
    tips = [
        {
            "tip": "Practice your short game for 70% of your practice time - it's where you'll see the biggest score improvements.",
            "category": "Practice",
            "level": "All"
        },
        {
            "tip": "Keep your head still during putting. Pick a spot behind the ball and don't look up until you hear it drop.",
            "category": "Putting", 
            "level": "Beginner"
        },
        {
            "tip": "For better distance control with wedges, practice with different length backswings rather than changing swing speed.",
            "category": "Short Game",
            "level": "Intermediate"
        },
        {
            "tip": "Play to the fat part of the green, not the pin. Your misses will still leave you with manageable putts.",
            "category": "Course Management",
            "level": "All"
        },
        {
            "tip": "Take one more club when hitting to an elevated green - the ball won't carry as far uphill.",
            "category": "Club Selection",
            "level": "Intermediate"
        }
    ]
    
    return {
        "daily_tip": random.choice(tips),
        "additional_tips": random.sample(tips, 3)
    }

@router.get("/golf-terms")
def get_golf_terms_glossary():
    """
    Get comprehensive golf terms glossary
    """
    return {
        "basic_terms": {
            "par": "The standard number of strokes for a skilled golfer to complete a hole",
            "birdie": "One stroke under par",
            "eagle": "Two strokes under par", 
            "bogey": "One stroke over par",
            "handicap": "A numerical measure of a golfer's playing ability"
        },
        "course_terms": {
            "fairway": "The closely mown area between tee and green",
            "rough": "Areas of longer grass adjacent to fairways",
            "bunker": "Sand-filled hazard on the course",
            "green": "The closely mown putting surface around the hole",
            "tee_box": "The starting area for each hole"
        },
        "scoring_terms": {
            "ace": "Hole-in-one",
            "albatross": "Three strokes under par (very rare)",
            "double_bogey": "Two strokes over par",
            "triple_bogey": "Three strokes over par"
        }
    }

@router.get("/rules-quick-reference")
def get_golf_rules_reference():
    """
    Get quick reference for common golf rules
    """
    return {
        "basic_rules": [
            {
                "situation": "Ball in water hazard",
                "rule": "Take one-stroke penalty and drop behind hazard, or replay from previous position"
            },
            {
                "situation": "Lost ball",
                "rule": "Stroke and distance - replay from where you last played with one-stroke penalty"
            },
            {
                "situation": "Out of bounds",
                "rule": "Stroke and distance - replay from previous position with one-stroke penalty"
            },
            {
                "situation": "Unplayable lie",
                "rule": "Take one-stroke penalty and drop within two club lengths, or drop on line behind ball and hole"
            }
        ],
        "etiquette": [
            "Repair divots and ball marks",
            "Rake bunkers after use", 
            "Keep pace of play - ready golf",
            "Stay quiet during others' shots",
            "Let faster groups play through"
        ],
        "safety": [
            "Yell 'Fore!' if ball heads toward people",
            "Wait for group ahead to be out of range",
            "Be aware of your surroundings when swinging"
        ]
    }
