import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MatchPreferences {
  skillLevel: string;
  playingStyle: string;
  availability: string[];
  handicapRange: number[];
  competitiveness: string;
}

interface Player {
  id: number;
  name: string;
  location: string;
  profileImage: string;
  skillLevel: string;
  handicap: number;
  playingStyle: string;
  availability: string[];
  competitiveness: string;
  bio: string;
  matchScore: number;
  compatibilityReasons: string[];
}

export default function AIPlayerMatching() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('Tampa, FL');
  const [preferences, setPreferences] = useState<MatchPreferences>({
    skillLevel: 'Intermediate',
    playingStyle: 'Casual',
    availability: ['Weekend mornings', 'Weekend afternoons'],
    handicapRange: [10, 20],
    competitiveness: 'Moderate'
  });
  const [suggestedMatches, setSuggestedMatches] = useState<Player[]>([]);
  const [showPreferences, setShowPreferences] = useState(false);

  const generateMatches = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const matches = generateMockMatches();
      setSuggestedMatches(matches);
      setLoading(false);
    }, 2000);
  };

  const generateMockMatches = (): Player[] => {
    // In a real app, this would call your backend AI matching algorithm
    const mockPlayers: Player[] = [
      {
        id: 1,
        name: "Jordan Smith",
        location: "Tampa, FL",
        profileImage: "https://i.pravatar.cc/150?img=1",
        skillLevel: "Intermediate",
        handicap: 14,
        playingStyle: "Casual",
        availability: ["Weekend mornings", "Weekday evenings"],
        competitiveness: "Moderate",
        bio: "Been playing for 5 years. Love the social aspect of golf and meeting new players.",
        matchScore: 92,
        compatibilityReasons: [
          "Similar skill level",
          "Compatible playing styles",
          "Overlapping availability on weekends"
        ]
      },
      {
        id: 2,
        name: "Alex Johnson",
        location: "Tampa, FL",
        profileImage: "https://i.pravatar.cc/150?img=2",
        skillLevel: "Advanced",
        handicap: 8,
        playingStyle: "Strategic",
        availability: ["Weekend afternoons", "Weekday mornings"],
        competitiveness: "High",
        bio: "Single-digit handicapper looking for regular playing partners to improve my game.",
        matchScore: 85,
        compatibilityReasons: [
          "Can help improve your game",
          "Overlapping weekend availability",
          "Close proximity"
        ]
      },
      {
        id: 3,
        name: "Morgan Lee",
        location: "Tampa, FL",
        profileImage: "https://i.pravatar.cc/150?img=3",
        skillLevel: "Beginner",
        handicap: 22,
        playingStyle: "Casual",
        availability: ["Weekend mornings", "Weekend afternoons"],
        competitiveness: "Low",
        bio: "New to golf and looking for patient partners to learn with. Always up for a fun round!",
        matchScore: 78,
        compatibilityReasons: [
          "Similar casual approach to the game",
          "Fully matching weekend availability",
          "Close proximity"
        ]
      },
      {
        id: 4,
        name: "Taylor Williams",
        location: "St. Petersburg, FL",
        profileImage: "https://i.pravatar.cc/150?img=4",
        skillLevel: "Pro",
        handicap: 2,
        playingStyle: "Competitive",
        availability: ["Weekday afternoons", "Weekend mornings"],
        competitiveness: "Very high",
        bio: "Former college player looking for serious golfers to compete with. Can also provide tips.",
        matchScore: 67,
        compatibilityReasons: [
          "Can provide valuable mentorship",
          "Some overlapping availability",
          "Different competitiveness levels"
        ]
      },
    ];
    
    // Sort by match score
    return mockPlayers.sort((a, b) => b.matchScore - a.matchScore);
  };

  const updatePreference = (key: keyof MatchPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-semibold text-base">AI Player Matching</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!loading && suggestedMatches.length === 0 ? (
          <div>
            <p className="text-sm text-neutral-600 mb-4">
              Our AI will find your perfect golf partners based on skill level, playing style, and availability.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Your Location
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mb-2"
                placeholder="City, State"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-neutral-700">Match Preferences</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPreferences(!showPreferences)}
                  className="text-xs h-8 px-2"
                >
                  {showPreferences ? "Hide" : "Customize"}
                </Button>
              </div>
              
              {showPreferences && (
                <div className="space-y-3 mb-3 bg-neutral-50 p-3 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Skill Level
                    </label>
                    <Select
                      value={preferences.skillLevel}
                      onValueChange={(value) => updatePreference("skillLevel", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Pro">Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Playing Style
                    </label>
                    <Select
                      value={preferences.playingStyle}
                      onValueChange={(value) => updatePreference("playingStyle", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select playing style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Casual">Casual & Relaxed</SelectItem>
                        <SelectItem value="Social">Social & Fun</SelectItem>
                        <SelectItem value="Strategic">Strategic & Focused</SelectItem>
                        <SelectItem value="Competitive">Competitive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Competitiveness
                    </label>
                    <Select
                      value={preferences.competitiveness}
                      onValueChange={(value) => updatePreference("competitiveness", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select competitiveness" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Just for fun</SelectItem>
                        <SelectItem value="Moderate">Like to improve</SelectItem>
                        <SelectItem value="High">Play to win</SelectItem>
                        <SelectItem value="Very high">Serious competitor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {!showPreferences && (
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {preferences.skillLevel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {preferences.playingStyle}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {preferences.competitiveness} Competition
                  </Badge>
                </div>
              )}
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={generateMatches}
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Find My Perfect Golf Partners
            </Button>
          </div>
        ) : loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-neutral-600 mb-2">Finding your perfect matches...</p>
            <p className="text-sm text-neutral-500">
              Our AI is analyzing player profiles, comparing playing styles, schedules, and skill levels
            </p>
          </div>
        ) : suggestedMatches.length > 0 ? (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-semibold">Your Top Matches</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSuggestedMatches([])}
                className="text-xs"
              >
                Reset
              </Button>
            </div>
            
            <div className="space-y-4">
              {suggestedMatches.map(player => (
                <div key={player.id} className="bg-white border rounded-lg overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="rounded-full overflow-hidden w-16 h-16 mr-4 flex-shrink-0">
                        <img src={player.profileImage} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{player.name}</h4>
                            <div className="text-sm text-neutral-600 mb-1">
                              <div className="flex items-center">
                                <svg className="h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>{player.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getMatchScoreColor(player.matchScore)}`}>
                            {player.matchScore}% Match
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {player.skillLevel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Handicap: {player.handicap}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {player.playingStyle}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-neutral-600 mb-2">{player.bio}</p>
                        
                        <div className="mb-3">
                          <div className="text-xs font-medium text-neutral-700 mb-1">Why you'd be a good match:</div>
                          <ul className="text-xs text-neutral-600 list-disc list-inside">
                            {player.compatibilityReasons.map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                              <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                            </svg>
                            Message
                          </Button>
                          <Button variant="default" size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            Invite to Play
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Show More Matches
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}