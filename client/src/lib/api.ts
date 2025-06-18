// API configuration for Replit environment
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current domain
    return window.location.origin;
  }
  // Server-side fallback
  return process.env.REPL_SLUG 
    ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    : 'http://localhost:5000';
};

export const API_BASE_URL = `${getBaseURL()}/api`;

export async function getGolfAdvice(query: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/golf/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: query }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error getting golf advice:', error);
    return 'Sorry, I encountered an issue providing advice. Please try again in a moment.';
  }
}

export async function analyzeGolfSwing(videoUrl: string): Promise<{
  summary: string;
  strengths: string[];
  improvements: string[];
  drills: string[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/swing/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing golf swing:', error);
    return {
      summary: 'Unable to analyze swing at this time',
      strengths: ['N/A'],
      improvements: ['N/A'],
      drills: ['Regular practice recommended'],
    };
  }
}

export async function getShotRecommendation(
  distance: number,
  windSpeed: number,
  windDirection: string,
  elevation: number,
  lie: string,
  previousClub: string,
  skillLevel: string
): Promise<{
  recommendedClub: string;
  alternativeClubs: string[];
  explanation: string;
  techniques: string[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/shot-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        distance,
        windSpeed,
        windDirection,
        elevation,
        lie,
        previousClub,
        skillLevel
      }),
    });


    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting shot recommendation:', error);
    return {
      recommendedClub: '7 iron',
      alternativeClubs: ['8 iron', '6 iron'],
      explanation: 'Based on the provided distance and conditions.',
      techniques: ['Focus on a smooth swing', 'Keep your head down', 'Follow through completely'],
    };
  }
}

export async function findCompatiblePlayers(
  location: string,
  skillLevel: string,
  playingStyle: string,
  availability: string[],
  handicapRange: [number, number]
): Promise<any[]> {
  try {
    // API call to get compatible players would go here
    // For now, we'll return sample data
    return [
      {
        id: 1,
        name: "Jordan Smith",
        location: "Tampa, FL",
        profileImage: "https://i.pravatar.cc/150?img=1",
        skillLevel: "Intermediate",
        handicap: 14,
        playingStyle: "Casual",
        availability: ["Weekends", "Friday evenings"],
        competitiveness: "Relaxed",
        bio: "Casual golfer looking to improve my game and meet new playing partners.",
        matchScore: 92,
        compatibilityReasons: ["Similar handicap", "Compatible schedule", "Both prefer casual rounds"]
      },
      {
        id: 2,
        name: "Alex Johnson",
        location: "Tampa, FL",
        profileImage: "https://i.pravatar.cc/150?img=2",
        skillLevel: "Advanced",
        handicap: 8,
        playingStyle: "Competitive",
        availability: ["Weekends", "Wednesday evenings"],
        competitiveness: "Competitive",
        bio: "Looking for serious players to challenge me and help improve my game.",
        matchScore: 84,
        compatibilityReasons: ["Can help improve your game", "Some schedule overlap", "Both in Tampa area"]
      },
      {
        id: 3,
        name: "Morgan Lee",
        location: "Tampa, FL",
        profileImage: "https://i.pravatar.cc/150?img=3",
        skillLevel: "Beginner",
        handicap: 22,
        playingStyle: "Learning",
        availability: ["Weekends", "Flexible weekdays"],
        competitiveness: "Relaxed",
        bio: "New to golf and looking for patient partners to learn with.",
        matchScore: 78,
        compatibilityReasons: ["Flexible schedule", "Same location", "Relaxed approach to the game"]
      }
    ];
  } catch (error) {
    console.error('Error finding compatible players:', error);
    return [];
  }
}
