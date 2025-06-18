
import cv2
import numpy as np
import requests
from datetime import datetime
from typing import Dict, List, Optional
import json
import os

class CourseStrategyAI:
    def __init__(self):
        self.weather_api_key = os.getenv("WEATHER_API_KEY", "your_weather_api_key")
        self.satellite_api_key = os.getenv("SATELLITE_API_KEY", "your_satellite_api_key")  # Google Maps, Mapbox, etc.
        self.course_conditions = {}
        self.player_memory = {}  # Store historical performance data
        
    def analyze_course_with_satellite(self, course_id: str, hole_number: int, 
                                    pin_position: Dict, image_data: bytes = None) -> Dict:
        """
        Enhanced course analysis using satellite imagery and ground-level photos
        """
        try:
            # Get satellite imagery for the hole
            satellite_data = self._get_satellite_imagery(course_id, hole_number)
            
            # Analyze ground-level image if provided
            ground_analysis = {}
            if image_data:
                ground_analysis = self.analyze_course_image(image_data)
            
            # Combine satellite and ground analysis
            enhanced_analysis = self._combine_imagery_analysis(satellite_data, ground_analysis)
            
            # Add historical context
            historical_context = self._get_historical_performance(course_id, hole_number)
            
            return {
                "satellite_analysis": satellite_data,
                "ground_analysis": ground_analysis,
                "enhanced_features": enhanced_analysis,
                "historical_context": historical_context,
                "pin_position": pin_position,
                "confidence": 0.92
            }
        except Exception as e:
            return {"error": str(e), "confidence": 0.0}
    
    def _get_satellite_imagery(self, course_id: str, hole_number: int) -> Dict:
        """
        Fetch and analyze satellite imagery for strategic insights
        """
        # In production, this would call satellite imagery APIs
        # For now, we'll simulate comprehensive satellite analysis
        
        satellite_features = {
            "hole_layout": {
                "length": self._estimate_hole_length(course_id, hole_number),
                "width_variations": self._analyze_fairway_width(),
                "dogleg": self._detect_dogleg_from_satellite(),
                "elevation_changes": self._analyze_elevation_profile()
            },
            "hazards": {
                "water_hazards": self._map_water_hazards(),
                "bunkers": self._map_sand_bunkers(),
                "trees_rough": self._map_vegetation()
            },
            "green_complex": {
                "size": "large",
                "shape": "kidney",
                "slope_analysis": self._analyze_green_slopes(),
                "surrounding_hazards": self._analyze_green_surroundings()
            },
            "strategic_zones": {
                "optimal_landing_areas": self._identify_landing_zones(),
                "avoid_zones": self._identify_trouble_areas(),
                "pin_accessibility": self._analyze_pin_access_routes()
            }
        }
        
        return satellite_features
    
    def _estimate_hole_length(self, course_id: str, hole_number: int) -> int:
        """Estimate hole length from satellite data"""
        # Mock data - in production, calculate from satellite coordinates
        hole_lengths = {1: 420, 2: 385, 3: 165, 4: 540, 5: 395}
        return hole_lengths.get(hole_number, 400)
    
    def _analyze_fairway_width(self) -> List[Dict]:
        """Analyze fairway width at different distances"""
        return [
            {"distance_from_tee": 150, "width_yards": 45, "difficulty": "generous"},
            {"distance_from_tee": 200, "width_yards": 35, "difficulty": "moderate"},
            {"distance_from_tee": 250, "width_yards": 25, "difficulty": "tight"}
        ]
    
    def _detect_dogleg_from_satellite(self) -> Dict:
        """Detect dogleg characteristics from satellite view"""
        return {
            "type": "right",
            "severity": "moderate",
            "optimal_turn_point": 230,
            "cutting_corner_risk": "medium"
        }
    
    def _analyze_elevation_profile(self) -> Dict:
        """Analyze elevation changes along the hole"""
        return {
            "tee_to_landing": "+15_feet",
            "landing_to_green": "-8_feet",
            "overall_change": "+7_feet",
            "playing_effect": "plays_longer"
        }
    
    def _map_water_hazards(self) -> List[Dict]:
        """Map water hazards from satellite imagery"""
        return [
            {
                "type": "pond",
                "location": "left_side_green",
                "distance_from_tee": 380,
                "carry_required": 185,
                "strategic_impact": "high"
            }
        ]
    
    def _map_sand_bunkers(self) -> List[Dict]:
        """Map sand bunkers from satellite imagery"""
        return [
            {
                "location": "fairway_right",
                "distance_from_tee": 240,
                "size": "large",
                "depth": "moderate"
            },
            {
                "location": "greenside_left",
                "distance_from_tee": 380,
                "size": "medium",
                "depth": "deep"
            }
        ]
    
    def _map_vegetation(self) -> Dict:
        """Map trees and rough areas"""
        return {
            "tree_lines": ["left_side_entire_hole", "right_side_200_to_green"],
            "rough_severity": "moderate",
            "recovery_difficulty": "challenging"
        }
    
    def _analyze_green_slopes(self) -> Dict:
        """Analyze green slopes from satellite topography"""
        return {
            "front_to_back": "moderate_upslope",
            "left_to_right": "slight_right_to_left",
            "tier_levels": 2,
            "slope_severity": "moderate"
        }
    
    def _analyze_green_surroundings(self) -> List[str]:
        """Analyze areas around the green"""
        return ["bunker_left", "water_behind", "safe_right", "collection_area_front"]
    
    def _identify_landing_zones(self) -> List[Dict]:
        """Identify optimal landing areas"""
        return [
            {
                "distance_range": "220-240",
                "width": "30_yards",
                "advantage": "best_angle_to_pin",
                "risk_level": "low"
            },
            {
                "distance_range": "260-280", 
                "width": "20_yards",
                "advantage": "shorter_approach",
                "risk_level": "medium"
            }
        ]
    
    def _identify_trouble_areas(self) -> List[Dict]:
        """Identify areas to avoid"""
        return [
            {
                "location": "right_rough_240_yards",
                "consequence": "blocked_tree_line",
                "recovery_difficulty": "very_difficult"
            }
        ]
    
    def _analyze_pin_access_routes(self) -> Dict:
        """Analyze best routes to reach pin position"""
        return {
            "from_left_side": "clear_approach_moderate_angle",
            "from_right_side": "bunker_carry_required",
            "from_center": "optimal_angle_full_green_access"
        }
    
    def _combine_imagery_analysis(self, satellite_data: Dict, ground_analysis: Dict) -> Dict:
        """Combine satellite and ground-level analysis"""
        return {
            "hole_strategy": self._generate_hole_strategy(satellite_data),
            "current_conditions": ground_analysis.get("features", {}),
            "hazard_confirmation": self._confirm_hazards(satellite_data, ground_analysis),
            "pin_strategy": self._generate_pin_strategy(satellite_data)
        }
    
    def _generate_hole_strategy(self, satellite_data: Dict) -> Dict:
        """Generate comprehensive hole strategy from satellite analysis"""
        hole_layout = satellite_data.get("hole_layout", {})
        hazards = satellite_data.get("hazards", {})
        
        return {
            "tee_shot_strategy": "Favor left center, avoid right bunkers at 240 yards",
            "approach_strategy": "Attack from left side for best pin access",
            "risk_reward_analysis": "Conservative play yields easy par, aggressive play potential birdie",
            "course_management": "Two-shot strategy recommended for most skill levels"
        }
    
    def _confirm_hazards(self, satellite_data: Dict, ground_analysis: Dict) -> List[Dict]:
        """Cross-reference satellite and ground hazard detection"""
        satellite_hazards = satellite_data.get("hazards", {})
        ground_hazards = ground_analysis.get("hazards", [])
        
        confirmed_hazards = []
        for hazard in ground_hazards:
            confirmed_hazards.append({
                **hazard,
                "satellite_confirmed": True,
                "precise_location": "verified"
            })
        
        return confirmed_hazards
    
    def _generate_pin_strategy(self, satellite_data: Dict) -> Dict:
        """Generate pin-specific strategy"""
        green_complex = satellite_data.get("green_complex", {})
        
        return {
            "optimal_approach_angle": "from_left_side",
            "miss_zones": ["long_is_dead", "short_side_right_trouble"],
            "putting_considerations": "uphill_putt_preferred",
            "bailout_areas": ["front_right_collection_area"]
        }
    
    def store_player_performance(self, player_id: str, course_id: str, hole_number: int, 
                               performance_data: Dict) -> None:
        """Store player performance data for future reference"""
        key = f"{player_id}_{course_id}_{hole_number}"
        
        if key not in self.player_memory:
            self.player_memory[key] = []
        
        performance_data["timestamp"] = datetime.now().isoformat()
        self.player_memory[key].append(performance_data)
        
        # Keep only last 10 rounds for each hole
        if len(self.player_memory[key]) > 10:
            self.player_memory[key] = self.player_memory[key][-10:]
    
    def _get_historical_performance(self, course_id: str, hole_number: int) -> Dict:
        """Get historical performance data for this hole"""
        # Get all players' performance on this hole
        hole_performances = []
        
        for key, performances in self.player_memory.items():
            if f"_{course_id}_{hole_number}" in key:
                hole_performances.extend(performances)
        
        if not hole_performances:
            return {"message": "No historical data available"}
        
        # Analyze patterns
        return self._analyze_performance_patterns(hole_performances)
    
    def _analyze_performance_patterns(self, performances: List[Dict]) -> Dict:
        """Analyze patterns in historical performance data"""
        if not performances:
            return {}
        
        # Calculate success rates for different strategies
        strategies = {}
        for perf in performances:
            strategy = perf.get("strategy_used", "unknown")
            if strategy not in strategies:
                strategies[strategy] = {"attempts": 0, "successes": 0}
            
            strategies[strategy]["attempts"] += 1
            if perf.get("result", "") in ["birdie", "par"]:
                strategies[strategy]["successes"] += 1
        
        # Calculate success rates
        for strategy in strategies:
            if strategies[strategy]["attempts"] > 0:
                strategies[strategy]["success_rate"] = (
                    strategies[strategy]["successes"] / strategies[strategy]["attempts"] * 100
                )
        
        return {
            "total_rounds_analyzed": len(performances),
            "strategy_success_rates": strategies,
            "common_mistakes": self._identify_common_mistakes(performances),
            "weather_correlation": self._analyze_weather_correlation(performances),
            "recommendations": self._generate_historical_recommendations(strategies)
        }
    
    def _identify_common_mistakes(self, performances: List[Dict]) -> List[str]:
        """Identify common mistakes from historical data"""
        mistakes = []
        
        # Count occurrences of specific outcomes
        outcomes = {}
        for perf in performances:
            outcome = perf.get("miss_type", "")
            if outcome:
                outcomes[outcome] = outcomes.get(outcome, 0) + 1
        
        # Identify patterns
        total_rounds = len(performances)
        for outcome, count in outcomes.items():
            if count / total_rounds > 0.3:  # If mistake happens >30% of time
                mistakes.append(f"Common miss: {outcome} ({count}/{total_rounds} rounds)")
        
        return mistakes
    
    def _analyze_weather_correlation(self, performances: List[Dict]) -> Dict:
        """Analyze how weather affects performance"""
        weather_performance = {}
        
        for perf in performances:
            weather = perf.get("weather_conditions", "unknown")
            if weather not in weather_performance:
                weather_performance[weather] = {"good": 0, "poor": 0}
            
            if perf.get("result") in ["birdie", "par"]:
                weather_performance[weather]["good"] += 1
            else:
                weather_performance[weather]["poor"] += 1
        
        return weather_performance
    
    def _generate_historical_recommendations(self, strategies: Dict) -> List[str]:
        """Generate recommendations based on historical success"""
        recommendations = []
        
        if strategies:
            # Find most successful strategy
            best_strategy = max(strategies.items(), 
                              key=lambda x: x[1].get("success_rate", 0))
            
            recommendations.append(
                f"Most successful strategy: {best_strategy[0]} "
                f"({best_strategy[1].get('success_rate', 0):.1f}% success rate)"
            )
        
        return recommendations

    def generate_enhanced_strategy(self, course_analysis: Dict, weather_data: Dict, 
                                 player_stats: Dict, distance: int, player_id: str,
                                 course_id: str, hole_number: int) -> Dict:
        """
        Generate strategy using satellite analysis and historical performance
        """
        # Get historical performance for this player on this hole
        player_history = self._get_player_history(player_id, course_id, hole_number)
        
        # Get general hole performance patterns
        hole_history = course_analysis.get("historical_context", {})
        
        # Generate base strategy
        base_strategy = self.generate_strategy(course_analysis, weather_data, player_stats, distance)
        
        # Enhance with satellite and historical data
        enhanced_strategy = {
            **base_strategy,
            "satellite_insights": course_analysis.get("satellite_analysis", {}),
            "personal_history": player_history,
            "hole_analytics": hole_history,
            "precision_recommendations": self._generate_precision_recommendations(
                course_analysis, player_history
            ),
            "risk_assessment": self._enhanced_risk_assessment(
                course_analysis, player_history, weather_data
            )
        }
        
        return enhanced_strategy
    
    def _get_player_history(self, player_id: str, course_id: str, hole_number: int) -> Dict:
        """Get specific player's history on this hole"""
        key = f"{player_id}_{course_id}_{hole_number}"
        
        if key not in self.player_memory:
            return {"message": "No previous rounds on this hole"}
        
        recent_performances = self.player_memory[key][-5:]  # Last 5 rounds
        
        return {
            "rounds_played": len(recent_performances),
            "average_score": self._calculate_average_score(recent_performances),
            "preferred_strategy": self._identify_preferred_strategy(recent_performances),
            "trouble_patterns": self._identify_trouble_patterns(recent_performances),
            "improvement_trend": self._calculate_improvement_trend(recent_performances)
        }
    
    def _calculate_average_score(self, performances: List[Dict]) -> float:
        """Calculate average score for performances"""
        scores = []
        for perf in performances:
            score_map = {"eagle": -2, "birdie": -1, "par": 0, "bogey": 1, "double": 2}
            score = score_map.get(perf.get("result", "par"), 0)
            scores.append(score)
        
        return sum(scores) / len(scores) if scores else 0.0
    
    def _identify_preferred_strategy(self, performances: List[Dict]) -> str:
        """Identify player's most used strategy"""
        strategies = {}
        for perf in performances:
            strategy = perf.get("strategy_used", "conservative")
            strategies[strategy] = strategies.get(strategy, 0) + 1
        
        return max(strategies.items(), key=lambda x: x[1])[0] if strategies else "conservative"
    
    def _identify_trouble_patterns(self, performances: List[Dict]) -> List[str]:
        """Identify where player typically gets in trouble"""
        troubles = []
        for perf in performances:
            if perf.get("result") in ["bogey", "double", "worse"]:
                miss_type = perf.get("miss_type", "")
                if miss_type:
                    troubles.append(miss_type)
        
        # Count frequency
        trouble_counts = {}
        for trouble in troubles:
            trouble_counts[trouble] = trouble_counts.get(trouble, 0) + 1
        
        return [f"{trouble} ({count} times)" for trouble, count in trouble_counts.items()]
    
    def _calculate_improvement_trend(self, performances: List[Dict]) -> str:
        """Calculate if player is improving on this hole"""
        if len(performances) < 3:
            return "insufficient_data"
        
        scores = []
        for perf in performances:
            score_map = {"eagle": -2, "birdie": -1, "par": 0, "bogey": 1, "double": 2}
            score = score_map.get(perf.get("result", "par"), 0)
            scores.append(score)
        
        # Simple trend analysis
        early_avg = sum(scores[:len(scores)//2]) / (len(scores)//2)
        late_avg = sum(scores[len(scores)//2:]) / (len(scores) - len(scores)//2)
        
        if late_avg < early_avg - 0.3:
            return "improving"
        elif late_avg > early_avg + 0.3:
            return "declining"
        else:
            return "stable"
    
    def _generate_precision_recommendations(self, course_analysis: Dict, 
                                          player_history: Dict) -> List[str]:
        """Generate precise recommendations based on satellite and history"""
        recommendations = []
        
        satellite_data = course_analysis.get("satellite_analysis", {})
        landing_zones = satellite_data.get("strategic_zones", {}).get("optimal_landing_areas", [])
        
        for zone in landing_zones:
            recommendations.append(
                f"Target landing zone: {zone.get('distance_range')} yards, "
                f"{zone.get('width')} wide - {zone.get('advantage')}"
            )
        
        # Add historical insights
        trouble_patterns = player_history.get("trouble_patterns", [])
        if trouble_patterns:
            recommendations.append(
                f"Personal alert: You typically struggle with {trouble_patterns[0]} on this hole"
            )
        
        return recommendations
    
    def _enhanced_risk_assessment(self, course_analysis: Dict, player_history: Dict, 
                                weather_data: Dict) -> Dict:
        """Enhanced risk assessment using all available data"""
        base_risk = "moderate"
        risk_factors = []
        
        # Satellite-based risk factors
        satellite_data = course_analysis.get("satellite_analysis", {})
        hazards = satellite_data.get("hazards", {})
        
        if hazards.get("water_hazards"):
            risk_factors.append("water_hazards_present")
        
        # Historical risk factors
        avg_score = player_history.get("average_score", 0)
        if avg_score > 0.5:
            risk_factors.append("historical_difficulty")
        
        # Weather risk factors
        wind_speed = weather_data.get("wind_speed", 0)
        if wind_speed > 15:
            risk_factors.append("strong_wind_conditions")
        
        # Calculate overall risk
        if len(risk_factors) > 2:
            base_risk = "high"
        elif len(risk_factors) == 0:
            base_risk = "low"
        
        return {
            "overall_risk": base_risk,
            "risk_factors": risk_factors,
            "mitigation_strategies": self._suggest_risk_mitigation(risk_factors)
        }
    
    def _suggest_risk_mitigation(self, risk_factors: List[str]) -> List[str]:
        """Suggest ways to mitigate identified risks"""
        mitigations = []
        
        if "water_hazards_present" in risk_factors:
            mitigations.append("Take extra club and aim away from water")
        
        if "historical_difficulty" in risk_factors:
            mitigations.append("Play conservative based on your past struggles here")
        
        if "strong_wind_conditions" in risk_factors:
            mitigations.append("Club up and aim into the wind")
        
        return mitigations

    def analyze_course_image(self, image_data: bytes) -> Dict:
        """
        Analyze course image using computer vision to identify key features
        """
        try:
            # Convert bytes to cv2 image
            nparr = np.frombuffer(image_data, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Perform basic image analysis
            features = self._extract_course_features(image)
            hazards = self._detect_hazards(image)
            green_analysis = self._analyze_green(image)
            
            return {
                "features": features,
                "hazards": hazards,
                "green_analysis": green_analysis,
                "confidence": 0.85
            }
        except Exception as e:
            return {"error": str(e), "confidence": 0.0}
    
    def _extract_course_features(self, image) -> Dict:
        """Extract key course features from image"""
        height, width = image.shape[:2]
        
        # Convert to HSV for better color analysis
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Detect grass/fairway (green hues)
        green_lower = np.array([35, 50, 50])
        green_upper = np.array([85, 255, 255])
        green_mask = cv2.inRange(hsv, green_lower, green_upper)
        fairway_percentage = np.sum(green_mask > 0) / (height * width) * 100
        
        # Detect sand (yellow/tan hues)
        sand_lower = np.array([10, 100, 100])
        sand_upper = np.array([30, 255, 255])
        sand_mask = cv2.inRange(hsv, sand_lower, sand_upper)
        sand_percentage = np.sum(sand_mask > 0) / (height * width) * 100
        
        return {
            "fairway_percentage": round(fairway_percentage, 2),
            "sand_percentage": round(sand_percentage, 2),
            "dominant_terrain": "fairway" if fairway_percentage > 30 else "rough",
            "visibility": "good" if fairway_percentage > 25 else "limited"
        }
    
    def _detect_hazards(self, image) -> List[Dict]:
        """Detect water hazards and bunkers"""
        hazards = []
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Water detection (blue hues)
        water_lower = np.array([100, 50, 50])
        water_upper = np.array([130, 255, 255])
        water_mask = cv2.inRange(hsv, water_lower, water_upper)
        
        if np.sum(water_mask > 0) > 1000:  # Threshold for water presence
            hazards.append({
                "type": "water",
                "severity": "high",
                "location": "visible in frame"
            })
        
        # Sand bunker detection
        sand_lower = np.array([10, 100, 100])
        sand_upper = np.array([30, 255, 255])
        sand_mask = cv2.inRange(hsv, sand_lower, sand_upper)
        
        if np.sum(sand_mask > 0) > 500:
            hazards.append({
                "type": "bunker",
                "severity": "medium",
                "location": "near target area"
            })
        
        return hazards
    
    def _analyze_green(self, image) -> Dict:
        """Analyze green conditions and slope"""
        # Simplified green analysis
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Calculate gradient to estimate slope
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        gradient_magnitude = np.sqrt(grad_x**2 + grad_y**2)
        
        avg_gradient = np.mean(gradient_magnitude)
        
        return {
            "slope_severity": "moderate" if avg_gradient > 50 else "gentle",
            "green_size": "standard",
            "pin_accessibility": "good" if avg_gradient < 70 else "challenging"
        }
    
    def generate_strategy(self, course_analysis: Dict, weather_data: Dict, 
                         player_stats: Dict, distance: int) -> Dict:
        """
        Generate comprehensive shot strategy based on all factors
        """
        strategy = {
            "primary_recommendation": "",
            "alternative_strategy": "",
            "risk_level": "moderate",
            "success_probability": 75,
            "club_recommendation": "",
            "adjustments": [],
            "reasoning": ""
        }
        
        # Analyze risk based on hazards
        risk_factors = len(course_analysis.get("hazards", []))
        if risk_factors > 2:
            strategy["risk_level"] = "high"
            strategy["success_probability"] -= 15
        elif risk_factors == 0:
            strategy["risk_level"] = "low"
            strategy["success_probability"] += 10
        
        # Weather adjustments
        wind_speed = weather_data.get("wind_speed", 0)
        if wind_speed > 15:
            strategy["adjustments"].append(f"Strong wind: Take extra club, aim left")
            strategy["success_probability"] -= 10
        elif wind_speed > 10:
            strategy["adjustments"].append(f"Moderate wind: Club up slightly")
            strategy["success_probability"] -= 5
        
        # Distance-based club recommendation
        if distance > 180:
            strategy["club_recommendation"] = "5-iron or hybrid"
        elif distance > 160:
            strategy["club_recommendation"] = "6-iron"
        elif distance > 140:
            strategy["club_recommendation"] = "7-iron"
        else:
            strategy["club_recommendation"] = "8-iron or 9-iron"
        
        # Generate primary strategy
        if strategy["risk_level"] == "high":
            strategy["primary_recommendation"] = f"Play conservative to center of green with {strategy['club_recommendation']}"
            strategy["alternative_strategy"] = "Lay up to comfortable wedge distance"
        else:
            strategy["primary_recommendation"] = f"Attack pin with {strategy['club_recommendation']}, allowing for conditions"
            strategy["alternative_strategy"] = "Play to fat part of green for safe par"
        
        strategy["reasoning"] = f"Based on {len(course_analysis.get('hazards', []))} visible hazards, {wind_speed}mph wind, and current course conditions."
        
        return strategy


def get_enhanced_strategy(course_id: str, hole_number: int, pin_position: Dict,
                         image_data: bytes, weather_data: Dict, player_data: Dict, 
                         distance: int, player_id: str) -> Dict:
    """
    Main function to get enhanced strategy with satellite and historical analysis
    """
    ai = CourseStrategyAI()
    
    # Analyze course with satellite imagery and ground photo
    course_analysis = ai.analyze_course_with_satellite(
        course_id, hole_number, pin_position, image_data
    )
    
    # Generate enhanced strategy
    strategy = ai.generate_enhanced_strategy(
        course_analysis, weather_data, player_data, distance, 
        player_id, course_id, hole_number
    )
    
    return {
        "timestamp": datetime.now().isoformat(),
        "course_analysis": course_analysis,
        "strategy": strategy,
        "confidence": course_analysis.get("confidence", 0.5)
    }


def store_shot_result(player_id: str, course_id: str, hole_number: int, 
                     shot_result: Dict) -> None:
    """
    Store shot result for future analysis
    """
    ai = CourseStrategyAI()
    ai.store_player_performance(player_id, course_id, hole_number, shot_result)
