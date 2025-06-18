import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AICaddieAdviceProps {
  distance?: number;
  windSpeed?: number;
  windDirection?: string;
  elevation?: number;
  lie?: string;
  previousClub?: string;
  skillLevel?: string;
}

export default function AICaddieAdvice({
  distance = 175,
  windSpeed = 5,
  windDirection = "left to right",
  elevation = 0,
  lie = "fairway",
  previousClub = "7 iron",
  skillLevel = "Intermediate"
}: AICaddieAdviceProps) {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    // Simulate loading AI advice when props change
    if (analyzing) {
      setLoading(true);
      
      // Simulate API call with timeout
      const timer = setTimeout(() => {
        generateAIAdvice();
        setLoading(false);
        setAnalyzing(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [analyzing, distance, windSpeed, windDirection, elevation, lie]);

  const generateAIAdvice = () => {
    // In a real app, this would call your AI backend
    // For now, we'll generate simulated AI recommendations
    
    // Adjust for conditions
    let effectiveDistance = distance;
    
    // Wind adjustment (approximate)
    if (windDirection === "headwind") {
      effectiveDistance += (windSpeed * 2);
    } else if (windDirection === "tailwind") {
      effectiveDistance -= (windSpeed * 2);
    }
    
    // Elevation adjustment
    effectiveDistance += (elevation * 0.5);
    
    // Lie adjustment
    let lieMultiplier = 1;
    if (lie === "rough") {
      lieMultiplier = 0.9;
      effectiveDistance *= lieMultiplier;
    } else if (lie === "sand") {
      lieMultiplier = 0.75;
      effectiveDistance *= lieMultiplier;
    }
    
    // Determine recommended club based on adjusted distance
    const recommendedClub = getRecommendedClub(effectiveDistance, skillLevel);
    
    // Generate swing tips based on conditions
    const swingTips = generateSwingTips(lie, windDirection, skillLevel);
    
    // Generate strategy
    const strategy = generateStrategy(distance, lie, windDirection, windSpeed);
    
    // Set the advice state
    setAdvice({
      recommendedClub,
      alternativeClubs: getAlternativeClubs(effectiveDistance, recommendedClub, skillLevel),
      effectiveDistance,
      swingTips,
      strategy,
      lieAdjustment: lie !== "fairway" ? `${lie} lie reduces distance by ${Math.round((1-lieMultiplier)*100)}%` : null,
      windAdjustment: windSpeed > 0 ? `${windSpeed}mph ${windDirection} wind` : null,
      elevationAdjustment: elevation !== 0 ? `${elevation > 0 ? '+' : ''}${elevation} feet elevation` : null
    });
  };
  
  const getRecommendedClub = (distance: number, skillLevel: string): string => {
    // Simple mapping of distances to clubs
    // In reality, this would be much more sophisticated and personalized
    if (distance > 240) return "Driver";
    if (distance > 220) return "3 Wood";
    if (distance > 210) return "5 Wood";
    if (distance > 195) return "3 Hybrid";
    if (distance > 185) return "4 Iron";
    if (distance > 175) return "5 Iron";
    if (distance > 165) return "6 Iron";
    if (distance > 155) return "7 Iron";
    if (distance > 145) return "8 Iron";
    if (distance > 135) return "9 Iron";
    if (distance > 120) return "PW";
    if (distance > 100) return "GW";
    if (distance > 80) return "SW";
    if (distance > 20) return "LW";
    return "Putter";
  };
  
  const getAlternativeClubs = (distance: number, recommended: string, skillLevel: string): string[] => {
    // Simplified logic for alternative club suggestions
    const clubOrder = [
      "Driver", "3 Wood", "5 Wood", "3 Hybrid", "4 Iron", "5 Iron", 
      "6 Iron", "7 Iron", "8 Iron", "9 Iron", "PW", "GW", "SW", "LW", "Putter"
    ];
    
    const recommendedIndex = clubOrder.indexOf(recommended);
    
    // Suggest one club up and one club down if possible
    const alternatives: string[] = [];
    
    if (recommendedIndex > 0) {
      alternatives.push(clubOrder[recommendedIndex - 1]);
    }
    
    if (recommendedIndex < clubOrder.length - 1) {
      alternatives.push(clubOrder[recommendedIndex + 1]);
    }
    
    return alternatives;
  };
  
  const generateSwingTips = (lie: string, windDirection: string, skillLevel: string): string => {
    let tips = "";
    
    // Lie-specific tips
    if (lie === "fairway") {
      tips += "Take a normal stance and make a clean strike. ";
    } else if (lie === "rough") {
      tips += "Grip down slightly on the club and use a steeper swing to avoid the grass grabbing your clubhead. ";
    } else if (lie === "sand") {
      tips += "Open your stance, open the clubface, and hit the sand about 2 inches behind the ball. ";
    }
    
    // Wind tips
    if (windDirection === "left to right") {
      tips += "For this right-to-left wind, aim slightly right and let the wind bring the ball back. ";
    } else if (windDirection === "right to left") {
      tips += "For this left-to-right wind, aim slightly left and let the wind bring the ball back. ";
    } else if (windDirection === "headwind") {
      tips += "Into the wind, take more club and swing easier to keep the ball flight lower. ";
    } else if (windDirection === "tailwind") {
      tips += "With the wind, the ball will travel farther and roll more, so aim to land it shorter. ";
    }
    
    // Skill level tips
    if (skillLevel === "Beginner") {
      tips += "Focus on making solid contact rather than distance.";
    } else if (skillLevel === "Intermediate") {
      tips += "Try to control your ball flight to account for the conditions.";
    } else if (skillLevel === "Advanced" || skillLevel === "Pro") {
      tips += "Consider shaping your shot to take advantage of the wind and landing conditions.";
    }
    
    return tips;
  };
  
  const generateStrategy = (distance: number, lie: string, windDirection: string, windSpeed: number): string => {
    if (distance > 180 && lie === "rough") {
      return "Consider laying up to a comfortable distance rather than going for the green from this lie.";
    }
    
    if (windSpeed > 15) {
      return "Strong wind conditions - play conservatively and aim for the center of the green.";
    }
    
    if (lie === "sand" && distance > 150) {
      return "This is a challenging shot. Focus on getting back in play rather than trying to reach the green.";
    }
    
    return "You're in a good position - aim directly for your target with your recommended club.";
  };

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="font-semibold text-sm sm:text-base">AI Caddie Advice</CardTitle>
          {!analyzing && !loading && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAnalyzing(true)}
              className="text-xs self-start sm:self-center"
            >
              <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.84 6.71 2.26"></path>
                <path d="M21 3v9h-9"></path>
              </svg>
              Refresh Analysis
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-green-600 mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-neutral-600">AI is analyzing your shot...</p>
            <p className="text-xs sm:text-sm text-neutral-500">Considering distance, wind, lie, and your skill level</p>
          </div>
        ) : advice ? (
          <div>
            <div className="bg-green-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
              <div className="font-medium text-lg mb-1">Recommended: {advice.recommendedClub}</div>
              <div className="text-sm text-neutral-600 mb-2">
                Plays like {Math.round(advice.effectiveDistance)} yards
              </div>
              
              {(advice.windAdjustment || advice.elevationAdjustment || advice.lieAdjustment) && (
                <div className="text-xs text-neutral-500 mb-2">
                  <div className="font-medium mb-1">Adjustments considered:</div>
                  <ul className="list-disc list-inside">
                    {advice.windAdjustment && <li>{advice.windAdjustment}</li>}
                    {advice.elevationAdjustment && <li>{advice.elevationAdjustment}</li>}
                    {advice.lieAdjustment && <li>{advice.lieAdjustment}</li>}
                  </ul>
                </div>
              )}
            </div>
            
            {advice.alternativeClubs.length > 0 && (
              <div className="mb-4">
                <div className="font-medium mb-2">Alternative options:</div>
                <div className="grid grid-cols-2 gap-2">
                  {advice.alternativeClubs.map((club: string, idx: number) => (
                    <div key={idx} className="bg-neutral-100 p-3 rounded-lg">
                      <div className="font-medium">{club}</div>
                      <div className="text-xs text-neutral-600">
                        {club.includes("Wood") || club === "Driver" ? "More distance, less accuracy" : "More accuracy, less distance"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <div className="font-medium mb-1">Swing Tips:</div>
              <p className="text-sm text-neutral-600">{advice.swingTips}</p>
            </div>
            
            <div>
              <div className="font-medium mb-1">Strategy:</div>
              <p className="text-sm text-neutral-600">{advice.strategy}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="h-12 w-12 text-neutral-400 mb-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <p className="text-neutral-600 mb-4">Ready to analyze your shot</p>
            <Button 
              onClick={() => setAnalyzing(true)} 
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors min-h-[48px] px-6"
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 16.7a7 7 0 1 1-14 0"></path>
                <path d="M12 4v12"></path>
                <path d="m8 8 4-4 4 4"></path>
              </svg>
              Get AI Advice
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}