import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CourseMap from "@/components/CourseMap";
import ClubRecommendation from "@/components/ClubRecommendation";
import ShotRecording from "@/components/ShotRecording";
import { useGolfRound } from "@/hooks/useGolfRound";
import { useQuery } from "@tanstack/react-query";
import { Position, Club, ShotQuality, ShotResult } from "@shared/schema";
import { calculateAdjustedDistance, generateShotStrategy, recommendClubs } from "@/lib/golfUtils";
import SatelliteHoleView from './SatelliteHoleView';
import PlayerMemoryInsights from './PlayerMemoryInsights';

const CaddieTab = () => {
  const { 
    currentHole, 
    currentPosition, 
    setCurrentPosition,
    calculateDistanceToHole,
    getCurrentHoleData,
    recordShot,
    shots
  } = useGolfRound();

  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [distance, setDistance] = useState(0);
  const [adjustedDistance, setAdjustedDistance] = useState(0);

  // Mock weather conditions (in a real app, these would come from an API)
  const windSpeed = 5; // mph
  const windDirection = "right to left";
  const elevationChange = 8; // percent

  // Mock hazards (in a real app, these would come from course data)
  const hazards = ["water"];

  const { data: clubs = [] } = useQuery({
    queryKey: ["/api/users/1/clubs"], // Using a default user ID for now
  });

  const holeData = getCurrentHoleData();

  useEffect(() => {
    // If there's no current position set, use the tee position for the current hole
    if (!currentPosition && holeData) {
      setCurrentPosition(holeData.teePosition);
    }
  }, [currentPosition, holeData, setCurrentPosition]);

  useEffect(() => {
    if (currentPosition) {
      const dist = calculateDistanceToHole();
      setDistance(dist);

      const adjusted = calculateAdjustedDistance(
        dist,
        elevationChange,
        windSpeed,
        windDirection
      );
      setAdjustedDistance(adjusted);

      // Recommend a club based on the adjusted distance
      const recommendations = recommendClubs(clubs, adjusted);
      if (recommendations.length > 0 && !selectedClub) {
        setSelectedClub(recommendations[0]);
      }
    }
  }, [currentPosition, clubs, calculateDistanceToHole, selectedClub]);

  const handlePositionUpdate = (position: Position) => {
    setCurrentPosition(position);
  };

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
  };

  const handleRecordShot = (data: {
    club: string;
    result: ShotResult;
    quality: ShotQuality;
    notes?: string;
  }) => {
    if (!currentPosition || !holeData) return;

    // For simplicity, we'll set the end position closer to the hole
    const holePos = holeData.holePosition;
    const currentPos = currentPosition;

    // Calculate a position between current and hole (simulating the shot)
    const endPosition: Position = {
      x: currentPos.x + (holePos.x - currentPos.x) * 0.7,
      y: currentPos.y + (holePos.y - currentPos.y) * 0.7
    };

    recordShot({
      ...data,
      endPosition
    });
  };

  if (!holeData || !currentPosition) {
    return <div>Loading hole data...</div>;
  }

  // Generate shot path data for visualization
  const shotPaths = shots.map((shot, index, array) => {
    // For the first shot, start from tee
    const startPos = index === 0 
      ? holeData.teePosition 
      : array[index - 1].endPosition;

    return {
      startPosition: startPos,
      endPosition: shot.endPosition
    };
  });

  // Add current position to hole if there are shots
  if (shots.length > 0) {
    shotPaths.push({
      startPosition: shots[shots.length - 1].endPosition,
      endPosition: currentPosition
    });
  }

  const recommendedClubs = recommendClubs(clubs, adjustedDistance);
  const mainRecommendation = recommendedClubs[0] || clubs[0];
  const alternativeClubs = recommendedClubs.slice(1);

  // Generate shot strategy
  const strategy = generateShotStrategy(
    adjustedDistance,
    windSpeed,
    windDirection,
    hazards
  );

  return (
    <div>
      {/* Distance and Recommendation */}
      <Card className="mb-6 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="font-heading font-semibold text-base">Distance to Hole</CardTitle>
            <span className="text-sm text-neutral-600">Tap to update position</span>
          </div>
        </CardHeader>
        <CardContent>
          <CourseMap
            className="mb-4"
            holePosition={holeData.holePosition}
            currentPosition={currentPosition}
            shots={shotPaths}
            onPositionUpdate={handlePositionUpdate}
            hazards={holeData.hazards}
          />

          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold text-neutral-900">
                {distance} <span className="text-lg">yards</span>
              </div>
              <div className="text-sm text-neutral-600">
                {elevationChange}% uphill • Wind {windSpeed}mph {windDirection}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end">
                <span className="material-icons text-accent mr-1">warning</span>
                <span className="text-sm text-accent">Water hazard left</span>
              </div>
              <div className="text-sm text-neutral-600">
                Plays like {adjustedDistance} yards
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Club Recommendation */}
      {selectedClub && (
        <ClubRecommendation
          recommendedClub={mainRecommendation}
          alternativeClubs={alternativeClubs}
          onClubSelect={handleClubSelect}
        />
      )}

      {/* Shot Strategy */}
      <Card className="mb-6 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading font-semibold text-base">Shot Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-neutral-100 rounded-lg">
            <p className="text-neutral-700">{strategy}</p>
          </div>
        </CardContent>
      </Card>

      {/* Shot Recording */}
      {selectedClub && (
        <ShotRecording
          selectedClub={selectedClub}
          clubs={clubs}
          onRecordShot={handleRecordShot}
        />
      )}
    </div>
  );
};

export default CaddieTab;