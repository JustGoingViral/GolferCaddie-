import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Club } from "@shared/schema";
import { cn } from "@/lib/utils";

type ClubRecommendationProps = {
  recommendedClub: Club;
  alternativeClubs: Club[];
  onClubSelect: (club: Club) => void;
};

const ClubRecommendation = ({
  recommendedClub,
  alternativeClubs,
  onClubSelect
}: ClubRecommendationProps) => {
  const [selectedClub, setSelectedClub] = useState<Club>(recommendedClub);

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    onClubSelect(club);
  };

  const renderConfidenceStars = (confidence: number) => {
    return (
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => (
          <span 
            key={index} 
            className={cn(
              "material-icons",
              index < confidence ? "text-secondary" : "text-neutral-400"
            )}
          >
            {index < confidence ? "star" : "star_border"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading font-semibold text-base">Recommended Club</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-neutral-100 p-3 rounded-lg mb-4 flex items-center">
          <div className="flex-1">
            <div className="text-lg font-medium">{recommendedClub.name}</div>
            <div className="text-sm text-neutral-600">
              Your avg: {recommendedClub.averageDistance} yards
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600">Confidence</div>
            {renderConfidenceStars(recommendedClub.confidence)}
          </div>
        </div>
        
        <h4 className="text-sm font-medium text-neutral-700 mb-2">Other Options</h4>
        <div className="grid grid-cols-2 gap-2">
          {alternativeClubs.map((club) => (
            <div 
              key={club.id} 
              className={cn(
                "club-card border rounded-lg p-3 cursor-pointer hover:bg-neutral-50",
                selectedClub.id === club.id && "selected"
              )}
              onClick={() => handleClubSelect(club)}
            >
              <div className="font-medium">{club.name}</div>
              <div className="text-sm text-neutral-600">
                Your avg: {club.averageDistance} yards
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubRecommendation;
