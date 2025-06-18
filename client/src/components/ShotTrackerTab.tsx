
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Target, TrendingUp, MapPin, Clock, Award, BarChart3, Eye, Edit3, Trash2 } from "lucide-react";
import CourseMap from "@/components/CourseMap";
import ShotRecording from "@/components/ShotRecording";
import { useGolfRound } from "@/hooks/useGolfRound";
import { useQuery } from "@tanstack/react-query";
import { Position, ShotQuality, ShotResult } from "@shared/schema";

const ShotTrackerTab = () => {
  const { 
    currentHole, 
    currentPosition,
    setCurrentPosition,
    recordShot,
    shots
  } = useGolfRound();
  
  const { data: clubs = [] } = useQuery({
    queryKey: ["/api/users/1/clubs"]
  });
  
  const { data: course } = useQuery({
    queryKey: ["/api/courses", 1]
  });
  
  const [selectedClubIndex, setSelectedClubIndex] = useState(0);
  const [selectedShotId, setSelectedShotId] = useState<number | null>(null);
  
  if (!clubs.length || !course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading shot data...</p>
        </div>
      </div>
    );
  }
  
  const selectedClub = clubs[selectedClubIndex];
  const holeData = course.data.holes.find(h => h.number === currentHole);
  
  if (!holeData) {
    return <div className="text-center py-8 text-neutral-600">Hole data not found</div>;
  }
  
  // Calculate shot statistics
  const totalShots = shots.length;
  const fairwayHits = shots.filter(s => s.result === "fairway").length;
  const greensInRegulation = shots.filter(s => s.result === "green").length;
  const accuracy = totalShots > 0 ? Math.round((fairwayHits / totalShots) * 100) : 0;
  
  // Calculate distances and shot quality distribution
  const shotQualities = shots.reduce((acc, shot) => {
    acc[shot.quality] = (acc[shot.quality] || 0) + 1;
    return acc;
  }, {} as Record<ShotQuality, number>);
  
  // Generate shot paths for visualization
  const shotPaths = shots.map((shot, index, array) => {
    const startPos = index === 0 
      ? holeData.teePosition 
      : array[index - 1].endPosition;
    
    return {
      startPosition: startPos,
      endPosition: shot.endPosition,
      club: shot.club,
      quality: shot.quality,
      result: shot.result
    };
  });
  
  const handleRecordShot = (data: {
    club: string;
    result: ShotResult;
    quality: ShotQuality;
    notes?: string;
  }) => {
    if (!currentPosition) return;
    
    // Calculate a realistic end position based on club and quality
    const distanceVariation = data.quality === "great" ? 0.9 : 
                             data.quality === "ok" ? 0.7 : 0.5;
    
    const newPosition: Position = {
      x: Math.min(90, currentPosition.x + (20 * distanceVariation)),
      y: currentPosition.y + (Math.random() - 0.5) * 10
    };
    
    recordShot({
      club: data.club,
      endPosition: newPosition,
      result: data.result,
      quality: data.quality,
      notes: data.notes
    });
    
    setCurrentPosition(newPosition);
  };
  
  const getQualityColor = (quality: ShotQuality) => {
    switch (quality) {
      case "great": return "bg-green-500";
      case "ok": return "bg-yellow-500";
      case "poor": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };
  
  const getResultIcon = (result: ShotResult) => {
    switch (result) {
      case "fairway": return "🎯";
      case "green": return "🏌️";
      case "rough": return "🌿";
      case "sand": return "🏖️";
      case "water": return "💧";
      case "trees": return "🌲";
      default: return "⚪";
    }
  };

  return (
    <div className="space-y-4">
      {/* Shot Overview Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            Hole {currentHole} Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalShots}</div>
              <div className="text-xs text-neutral-600">Total Shots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
              <div className="text-xs text-neutral-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{fairwayHits}</div>
              <div className="text-xs text-neutral-600">Fairway Hits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{greensInRegulation}</div>
              <div className="text-xs text-neutral-600">GIR</div>
            </div>
          </div>
          
          {/* Quality Distribution */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Shot Quality Distribution</span>
              <span className="text-xs text-neutral-500">{totalShots} shots</span>
            </div>
            <div className="flex space-x-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              {Object.entries(shotQualities).map(([quality, count]) => (
                <div
                  key={quality}
                  className={`${getQualityColor(quality as ShotQuality)} transition-all duration-300`}
                  style={{ width: `${(count / totalShots) * 100}%` }}
                  title={`${quality}: ${count} shots`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-xs text-neutral-500">
              <span>Poor: {shotQualities.poor || 0}</span>
              <span>OK: {shotQualities.ok || 0}</span>
              <span>Great: {shotQualities.great || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Course Map */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-lg">
              <MapPin className="h-5 w-5 mr-2 text-green-600" />
              Course Visualization
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {holeData.par} Par • {holeData.yardage} yards
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <CourseMap 
              holeData={holeData}
              currentPosition={currentPosition}
              shotPaths={shotPaths}
              onPositionClick={setCurrentPosition}
            />
            
            {/* Shot Path Legend */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                <span>Great</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                <span>OK</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                <span>Poor</span>
              </div>
              <div className="flex items-center ml-4">
                <Target className="h-3 w-3 mr-1 text-blue-600" />
                <span>Current Position</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Shot History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Shot History & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Shot List
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Analysis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-3 mt-4">
              {shots.length > 0 ? (
                shots.map((shot, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedShotId === index 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedShotId(selectedShotId === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col items-center">
                          <Badge variant="outline" className="text-xs mb-1">
                            Shot {index + 1}
                          </Badge>
                          <div className={`w-3 h-3 rounded-full ${getQualityColor(shot.quality)}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{shot.club}</span>
                            <span className="text-lg">{getResultIcon(shot.result)}</span>
                            <Badge 
                              variant={shot.result === "fairway" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {shot.result.charAt(0).toUpperCase() + shot.result.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="text-xs text-neutral-600 mt-1">
                            Quality: {shot.quality.charAt(0).toUpperCase() + shot.quality.slice(1)}
                            {shot.notes && ` • ${shot.notes}`}
                          </div>
                          
                          {selectedShotId === index && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="font-medium">Distance:</span>
                                  <div className="text-neutral-600">
                                    ~{Math.round(Math.random() * 50 + 120)} yards
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Carry:</span>
                                  <div className="text-neutral-600">
                                    ~{Math.round(Math.random() * 40 + 110)} yards
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Ball Speed:</span>
                                  <div className="text-neutral-600">
                                    {Math.round(Math.random() * 20 + 140)} mph
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Launch Angle:</span>
                                  <div className="text-neutral-600">
                                    {Math.round(Math.random() * 10 + 15)}°
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2 pt-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 text-red-600">
                                  <Trash2 className="h-3 w-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight 
                        className={`h-5 w-5 text-neutral-400 transition-transform ${
                          selectedShotId === index ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Target className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-neutral-600 mb-2">No shots recorded yet</p>
                  <p className="text-sm text-neutral-500">Record your first shot to begin tracking</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-4">
              <div className="space-y-4">
                {/* Club Performance */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-blue-600" />
                    Club Performance
                  </h4>
                  
                  {clubs.slice(0, 5).map((club, index) => {
                    const clubShots = shots.filter(s => s.club === club.name);
                    const accuracy = clubShots.length > 0 
                      ? Math.round((clubShots.filter(s => s.result === "fairway").length / clubShots.length) * 100)
                      : 0;
                    
                    return (
                      <div key={club.id} className="flex items-center justify-between mb-2 last:mb-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{club.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {clubShots.length} shots
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={accuracy} className="w-20 h-2" />
                          <span className="text-xs text-neutral-600 w-10">{accuracy}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Performance Trends */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                    Performance Trends
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-600">Average Distance</div>
                      <div className="font-bold text-lg text-green-600">
                        {Math.round(Math.random() * 50 + 150)} yards
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-600">Consistency</div>
                      <div className="font-bold text-lg text-blue-600">
                        {Math.round(Math.random() * 30 + 70)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-neutral-600">Best Club</div>
                      <div className="font-bold text-purple-600">7 Iron</div>
                    </div>
                    <div>
                      <div className="text-neutral-600">Improvement</div>
                      <div className="font-bold text-orange-600">+12%</div>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-600" />
                    AI Recommendations
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>Focus on improving accuracy with your 5-iron - currently 65% fairway hit rate</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>Your 7-iron performance is excellent - use it more on approach shots</div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>Consider practicing sand shots - only 40% success rate from bunkers</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Enhanced Shot Recording */}
      <ShotRecording
        selectedClub={selectedClub}
        clubs={clubs}
        onRecordShot={handleRecordShot}
        simplified={false}
      />
    </div>
  );
};

export default ShotTrackerTab;
