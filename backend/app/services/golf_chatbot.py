import random
from typing import List, Dict
from datetime import datetime

class GolfChatbotAI:
    """AI Golf Chatbot for answering golf-related questions"""
    
    def __init__(self):
        # Golf knowledge base for generating responses
        self.golf_knowledge = {
            "rules": {
                "water_hazard": "If your ball lands in a water hazard, you have several options: play it as it lies (if possible), take a penalty stroke and drop behind the hazard, or replay from your previous position.",
                "out_of_bounds": "For out of bounds, you must replay from your previous position with a one-stroke penalty. This is stroke and distance.",
                "lost_ball": "You have 3 minutes to search for a lost ball. If not found, it's stroke and distance - replay from where you last played with a one-stroke penalty.",
                "unplayable": "You can declare any ball unplayable (except in a water hazard) and take relief with a one-stroke penalty."
            },
            "techniques": {
                "driving": "For better driving: maintain a wide stance, keep your head behind the ball, make a full shoulder turn, and focus on tempo rather than power.",
                "putting": "For better putting: keep your head still, maintain steady tempo, aim for the back of the cup, and practice your distance control.",
                "chipping": "For chipping: use a narrow stance, keep weight on your front foot, hands ahead of the ball, and make a crisp descending blow.",
                "bunker": "For bunker shots: open your stance and clubface, aim 2 inches behind the ball, and accelerate through the sand."
            },
            "equipment": {
                "driver": "Choose a driver based on your swing speed. Higher loft (10.5-12°) for slower swings, lower loft (8.5-10°) for faster swings.",
                "irons": "Game improvement irons have larger sweet spots and more forgiveness. Players irons offer more control but require better ball striking.",
                "putters": "Putter choice depends on your stroke. Blade putters for arc strokes, mallet putters for straight-back-straight-through strokes.",
                "wedges": "A basic wedge setup includes pitching wedge (45-48°), gap wedge (50-52°), sand wedge (54-56°), and lob wedge (58-60°)."
            },
            "course_management": {
                "strategy": "Play to your strengths, avoid your weaknesses. If you slice, aim left. If you're long off the tee, focus on accuracy over distance.",
                "club_selection": "Take enough club to clear trouble. It's better to be long than short when there's trouble in front of the green.",
                "mental_game": "Stay present, commit to your shot, and don't let bad shots affect future ones. Golf is played one shot at a time."
            }
        }
        
        # Common golf terms and their explanations
        self.golf_terms = {
            "albatross": "Three strokes under par on a hole",
            "eagle": "Two strokes under par on a hole", 
            "birdie": "One stroke under par on a hole",
            "par": "The standard score for a hole",
            "bogey": "One stroke over par on a hole",
            "double_bogey": "Two strokes over par on a hole",
            "handicap": "A numerical measure of a golfer's playing ability",
            "mulligan": "An informal 'do-over' shot (not allowed in official play)",
            "fore": "A warning shout when a ball might hit someone",
            "gimme": "A short putt that's conceded by opponents"
        }

    def generate_response(self, user_message: str) -> str:
        """Generate an AI response to the user's golf question"""
        message_lower = user_message.lower()
        
        # Check for specific topics
        if any(word in message_lower for word in ["rule", "rules", "legal", "penalty"]):
            return self._get_rules_response(message_lower)
        elif any(word in message_lower for word in ["technique", "how to", "improve", "tips", "swing"]):
            return self._get_technique_response(message_lower)
        elif any(word in message_lower for word in ["equipment", "club", "clubs", "driver", "iron", "putter"]):
            return self._get_equipment_response(message_lower)
        elif any(word in message_lower for word in ["strategy", "course", "management", "play"]):
            return self._get_strategy_response(message_lower)
        elif any(term in message_lower for term in self.golf_terms.keys()):
            return self._get_term_explanation(message_lower)
        elif any(word in message_lower for word in ["hello", "hi", "hey", "start"]):
            return self._get_greeting_response()
        elif any(word in message_lower for word in ["thank", "thanks", "bye", "goodbye"]):
            return self._get_closing_response()
        else:
            return self._get_general_response(message_lower)

    def _get_rules_response(self, message: str) -> str:
        """Get response about golf rules"""
        if "water" in message or "hazard" in message:
            return self.golf_knowledge["rules"]["water_hazard"]
        elif "out of bounds" in message or "ob" in message:
            return self.golf_knowledge["rules"]["out_of_bounds"]
        elif "lost" in message:
            return self.golf_knowledge["rules"]["lost_ball"]
        elif "unplayable" in message:
            return self.golf_knowledge["rules"]["unplayable"]
        else:
            return "Golf rules can be complex! The main principles are: play the ball as it lies, play the course as you find it, and if you can't do either, do what's fair. What specific rule situation are you asking about?"

    def _get_technique_response(self, message: str) -> str:
        """Get response about golf techniques"""
        if "driv" in message:
            return self.golf_knowledge["techniques"]["driving"]
        elif "putt" in message:
            return self.golf_knowledge["techniques"]["putting"]
        elif "chip" in message:
            return self.golf_knowledge["techniques"]["chipping"]
        elif "bunker" in message or "sand" in message:
            return self.golf_knowledge["techniques"]["bunker"]
        else:
            return "Golf technique improvement comes from practice and proper fundamentals. Focus on: setup, alignment, tempo, and balance. What specific aspect of your game would you like to work on?"

    def _get_equipment_response(self, message: str) -> str:
        """Get response about golf equipment"""
        if "driver" in message:
            return self.golf_knowledge["equipment"]["driver"]
        elif "iron" in message:
            return self.golf_knowledge["equipment"]["irons"]
        elif "putter" in message:
            return self.golf_knowledge["equipment"]["putters"]
        elif "wedge" in message:
            return self.golf_knowledge["equipment"]["wedges"]
        else:
            return "Golf equipment should match your skill level and swing characteristics. What specific club or equipment question do you have?"

    def _get_strategy_response(self, message: str) -> str:
        """Get response about course strategy"""
        if "club selection" in message or "which club" in message:
            return self.golf_knowledge["course_management"]["club_selection"]
        elif "mental" in message or "pressure" in message:
            return self.golf_knowledge["course_management"]["mental_game"]
        else:
            return self.golf_knowledge["course_management"]["strategy"]

    def _get_term_explanation(self, message: str) -> str:
        """Explain golf terms"""
        for term, explanation in self.golf_terms.items():
            if term in message:
                return f"{term.replace('_', ' ').title()}: {explanation}"
        return "That's a great golf term! Could you be more specific about what you'd like to know?"

    def _get_greeting_response(self) -> str:
        """Get a greeting response"""
        greetings = [
            "Hello! I'm here to help with all your golf questions. What would you like to know?",
            "Hi there! Whether it's rules, techniques, or equipment, I'm here to help improve your golf game.",
            "Welcome! I can help with golf rules, swing tips, course strategy, and more. What's on your mind?",
            "Hey! Ready to talk golf? I can help with anything from putting tips to rules clarifications."
        ]
        return random.choice(greetings)

    def _get_closing_response(self) -> str:
        """Get a closing response"""
        closings = [
            "You're welcome! Keep practicing and have fun out there on the course!",
            "Happy to help! May your drives be long and your putts be true!",
            "Glad I could assist! Remember, golf is a game of patience and practice.",
            "Anytime! Good luck with your next round!"
        ]
        return random.choice(closings)

    def _get_general_response(self, message: str) -> str:
        """Get a general response for unclear questions"""
        general_responses = [
            "That's an interesting golf question! Could you be more specific? I can help with rules, techniques, equipment, or course strategy.",
            "I'd love to help with that! Could you provide a bit more detail about what aspect of golf you're curious about?",
            "Great question! I can assist with golf rules, swing techniques, equipment selection, or course management. What would you like to focus on?",
            "I'm here to help with all things golf! Could you clarify what specific area you'd like assistance with?"
        ]
        return random.choice(general_responses)

def get_golf_chat_response(message: str, context: List[Dict] = None) -> str:
    """Main function to get a golf chatbot response"""
    chatbot = GolfChatbotAI()
    
    # Add some context awareness if needed
    if context and len(context) > 0:
        # Could use context to provide more personalized responses
        pass
    
    response = chatbot.generate_response(message)
    
    # Add timestamp and ensure response quality
    if len(response) < 10:
        response = "I'd be happy to help with your golf question! Could you provide a bit more detail?"
    
    return response
