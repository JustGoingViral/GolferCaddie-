
import math
from typing import Dict, List, Optional

class GolfAICaddie:
    """Advanced AI Caddie with sophisticated club selection and strategy logic"""
    
    def __init__(self):
        # Club distance mapping by skill level (average distances in yards)
        self.club_distances = {
            "Beginner": {
                "Driver": 200, "3 Wood": 180, "5 Wood": 160, "3 Hybrid": 150,
                "4 Iron": 140, "5 Iron": 130, "6 Iron": 120, "7 Iron": 110,
                "8 Iron": 100, "9 Iron": 90, "PW": 80, "GW": 70, "SW": 60, "LW": 50
            },
            "Amateur": {
                "Driver": 230, "3 Wood": 210, "5 Wood": 190, "3 Hybrid": 175,
                "4 Iron": 165, "5 Iron": 155, "6 Iron": 145, "7 Iron": 135,
                "8 Iron": 125, "9 Iron": 115, "PW": 105, "GW": 95, "SW": 80, "LW": 65
            },
            "Intermediate": {
                "Driver": 250, "3 Wood": 230, "5 Wood": 210, "3 Hybrid": 195,
                "4 Iron": 185, "5 Iron": 175, "6 Iron": 165, "7 Iron": 155,
                "8 Iron": 145, "9 Iron": 135, "PW": 125, "GW": 115, "SW": 100, "LW": 80
            },
            "Advanced": {
                "Driver": 270, "3 Wood": 250, "5 Wood": 230, "3 Hybrid": 215,
                "4 Iron": 205, "5 Iron": 195, "6 Iron": 185, "7 Iron": 175,
                "8 Iron": 165, "9 Iron": 155, "PW": 145, "GW": 135, "SW": 120, "LW": 100
            },
            "Pro": {
                "Driver": 290, "3 Wood": 270, "5 Wood": 250, "3 Hybrid": 235,
                "4 Iron": 225, "5 Iron": 215, "6 Iron": 205, "7 Iron": 195,
                "8 Iron": 185, "9 Iron": 175, "PW": 165, "GW": 155, "SW": 140, "LW": 120
            }
        }
        
        # Lie multipliers (how much each lie affects distance)
        self.lie_multipliers = {
            "fairway": 1.0,
            "rough": 0.85,
            "thick_rough": 0.70,
            "sand": 0.75,
            "tee": 1.05,
            "hardpan": 0.95,
            "pine_straw": 0.90,
            "uphill_lie": 0.90,
            "downhill_lie": 1.10
        }

    def calculate_effective_distance(self, base_distance: int, wind_speed: float, 
                                   wind_direction: str, elevation: int = 0, 
                                   lie: str = "fairway") -> int:
        """Calculate the effective distance accounting for all conditions"""
        effective_distance = base_distance
        
        # Wind adjustments
        if wind_direction.lower() in ["headwind", "into"]:
            effective_distance += (wind_speed * 2.5)
        elif wind_direction.lower() in ["tailwind", "behind", "with"]:
            effective_distance -= (wind_speed * 2.0)
        elif "cross" in wind_direction.lower():
            # Crosswind doesn't affect distance much but affects accuracy
            effective_distance += (wind_speed * 0.5)
        
        # Elevation adjustments (1 yard per 1 foot elevation for every 10 yards distance)
        elevation_adjustment = (elevation * base_distance) / 100
        effective_distance += elevation_adjustment
        
        # Lie adjustments
        lie_multiplier = self.lie_multipliers.get(lie.lower(), 1.0)
        if lie_multiplier != 1.0:
            effective_distance = int(effective_distance / lie_multiplier)
        
        return int(effective_distance)

    def find_best_club(self, target_distance: int, skill_level: str) -> Dict[str, str]:
        """Find the best club for the target distance"""
        distances = self.club_distances.get(skill_level, self.club_distances["Amateur"])
        
        best_club = None
        smallest_diff = float('inf')
        
        for club, club_distance in distances.items():
            diff = abs(club_distance - target_distance)
            if diff < smallest_diff:
                smallest_diff = diff
                best_club = club
        
        return {
            "primary": best_club,
            "distance_diff": smallest_diff
        }

    def get_alternative_clubs(self, target_distance: int, skill_level: str, 
                            primary_club: str) -> List[Dict[str, any]]:
        """Get alternative club options"""
        distances = self.club_distances.get(skill_level, self.club_distances["Amateur"])
        alternatives = []
        
        for club, club_distance in distances.items():
            if club != primary_club:
                diff = abs(club_distance - target_distance)
                if diff <= 15:  # Within 15 yards is considered alternative
                    strategy = "more distance" if club_distance > target_distance else "more accuracy"
                    alternatives.append({
                        "club": club,
                        "distance": club_distance,
                        "strategy": strategy,
                        "difference": diff
                    })
        
        # Sort by accuracy (closest to target)
        alternatives.sort(key=lambda x: x["difference"])
        return alternatives[:2]  # Return top 2 alternatives

    def generate_strategy_advice(self, distance: int, lie: str, wind_speed: float, 
                               wind_direction: str, hole_info: Dict = None) -> str:
        """Generate strategic advice based on conditions"""
        advice_parts = []
        
        # Distance-based strategy
        if distance > 200:
            advice_parts.append("Long approach shot - prioritize accuracy over distance.")
        elif distance < 100:
            advice_parts.append("Short approach - focus on pin position and spin control.")
        
        # Lie-based strategy
        if lie.lower() in ["rough", "thick_rough"]:
            advice_parts.append("From the rough, expect less spin and more roll.")
        elif lie.lower() == "sand":
            advice_parts.append("From sand, focus on clean contact and getting out safely.")
        elif lie.lower() in ["uphill_lie", "downhill_lie"]:
            advice_parts.append("Adjust your stance for the slope and expect different ball flight.")
        
        # Wind strategy
        if wind_speed > 15:
            advice_parts.append("Strong winds - play conservatively and aim for center of green.")
        elif wind_speed > 8:
            advice_parts.append("Moderate wind conditions - adjust your aim accordingly.")
        
        # Default strategy if no specific conditions
        if not advice_parts:
            advice_parts.append("Good position - commit to your club selection and trust your swing.")
        
        return " ".join(advice_parts)

    def generate_swing_tips(self, lie: str, wind_direction: str, skill_level: str, 
                          club: str) -> str:
        """Generate specific swing tips based on conditions"""
        tips = []
        
        # Lie-specific tips
        lie_tips = {
            "rough": "Grip down slightly and use a more upright swing to avoid grass interference.",
            "sand": "Open your stance, aim 2 inches behind the ball, and accelerate through impact.",
            "tee": "Tee the ball at proper height and make a smooth, confident swing.",
            "uphill_lie": "Position ball forward in stance and swing along the slope.",
            "downhill_lie": "Position ball back in stance and keep your weight on your front foot."
        }
        
        if lie.lower() in lie_tips:
            tips.append(lie_tips[lie.lower()])
        
        # Wind tips
        if "cross" in wind_direction.lower():
            tips.append("For crosswind, aim into the wind and let it bring the ball back to target.")
        elif "head" in wind_direction.lower():
            tips.append("Into the wind, swing easier with more club to keep ball flight lower.")
        elif "tail" in wind_direction.lower():
            tips.append("With tailwind, the ball will fly higher and roll more - plan accordingly.")
        
        # Club-specific tips
        if "iron" in club.lower():
            tips.append("Focus on crisp contact with a slightly descending blow.")
        elif "wood" in club.lower() or club == "Driver":
            tips.append("Make a smooth, sweeping motion and maintain your tempo.")
        elif club in ["PW", "GW", "SW", "LW"]:
            tips.append("For wedges, focus on acceleration through impact for proper spin.")
        
        # Skill level adjustments
        if skill_level == "Beginner":
            tips.append("Keep your swing simple and focus on making solid contact.")
        elif skill_level in ["Advanced", "Pro"]:
            tips.append("Consider shaping your shot based on pin position and conditions.")
        
        return " ".join(tips) if tips else "Trust your fundamentals and make a committed swing."

def get_ai_shot_recommendation(hole, distance, wind_speed=0, lie="fairway", 
                             past_club="7 iron", skill_level="Amateur", 
                             elevation=0, wind_direction="none"):
    """Enhanced AI shot recommendation with sophisticated analysis"""
    
    caddie = GolfAICaddie()
    
    # Calculate effective distance with all conditions
    effective_distance = caddie.calculate_effective_distance(
        distance, wind_speed, wind_direction, elevation, lie
    )
    
    # Find best club
    club_recommendation = caddie.find_best_club(effective_distance, skill_level)
    primary_club = club_recommendation["primary"]
    
    # Get alternative clubs
    alternatives = caddie.get_alternative_clubs(effective_distance, skill_level, primary_club)
    
    # Generate advice and tips
    strategy = caddie.generate_strategy_advice(distance, lie, wind_speed, wind_direction)
    swing_tips = caddie.generate_swing_tips(lie, wind_direction, skill_level, primary_club)
    
    # Build comprehensive AI explanation
    conditions = []
    if wind_speed > 0:
        conditions.append(f"{wind_speed}mph {wind_direction} wind")
    if elevation != 0:
        conditions.append(f"{elevation}ft elevation change")
    if lie != "fairway":
        conditions.append(f"{lie} lie")
    
    conditions_str = ", ".join(conditions) if conditions else "ideal conditions"
    
    ai_explanation = (
        f"Analyzing {distance} yard shot for {skill_level} player. "
        f"Considering {conditions_str}. "
        f"Effective playing distance: {effective_distance} yards. "
        f"Confidence: {95 - club_recommendation['distance_diff']}%"
    )
    
    # Determine expected outcome based on conditions and skill
    outcome_factors = []
    if club_recommendation["distance_diff"] <= 5:
        outcome_factors.append("high accuracy expected")
    if wind_speed <= 10 and lie == "fairway":
        outcome_factors.append("favorable conditions")
    if skill_level in ["Advanced", "Pro"]:
        outcome_factors.append("skilled execution likely")
    
    expected_outcome = "Green in regulation" if len(outcome_factors) >= 2 else "Good approach position"
    
    return {
        "club": primary_club,
        "suggestion": strategy,
        "tip": swing_tips,
        "wind": f"{wind_speed} mph {wind_direction}" if wind_speed > 0 else "Calm conditions",
        "yardage": distance,
        "effective_yardage": effective_distance,
        "expected_outcome": expected_outcome,
        "ai_explanation": ai_explanation,
        "alternatives": alternatives,
        "confidence": max(50, 95 - club_recommendation["distance_diff"])
    }
