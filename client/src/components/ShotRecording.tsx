import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Club, ShotQuality, ShotResult } from "@shared/schema";
import { getShotQualities, getShotResults } from "@/lib/golfUtils";

type ShotRecordingProps = {
  selectedClub: Club;
  clubs: Club[];
  onRecordShot: (data: {
    club: string;
    result: ShotResult;
    quality: ShotQuality;
    notes?: string;
  }) => void;
  simplified?: boolean;
};

const ShotRecording = ({
  selectedClub,
  clubs,
  onRecordShot,
  simplified = true
}: ShotRecordingProps) => {
  const [shotResult, setShotResult] = useState<ShotResult | null>(null);
  const [shotQuality, setShotQuality] = useState<ShotQuality | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [notes, setNotes] = useState("");
  
  const handleGoodShot = () => {
    onRecordShot({
      club: selectedClub.name,
      result: "fairway",
      quality: "great",
      notes: "Good shot"
    });
  };
  
  const handleMissedShot = () => {
    onRecordShot({
      club: selectedClub.name,
      result: "rough",
      quality: "poor",
      notes: "Missed shot"
    });
  };
  
  const handleDetailedSubmit = () => {
    if (!shotResult || !shotQuality) return;
    
    onRecordShot({
      club: selectedClub.name,
      result: shotResult,
      quality: shotQuality,
      notes
    });
    
    // Reset form
    setShotResult(null);
    setShotQuality(null);
    setNotes("");
    setShowDetails(false);
  };
  
  if (simplified) {
    return (
      <Card className="mb-6 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading font-semibold text-base">Record This Shot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-3">
            <Button
              variant="secondary"
              className="flex-1 py-2 px-4 font-medium flex justify-center items-center"
              onClick={handleGoodShot}
            >
              <span className="material-icons mr-1">check</span>
              Good Shot
            </Button>
            <Button
              variant="outline"
              className="flex-1 py-2 px-4 font-medium flex justify-center items-center"
              onClick={handleMissedShot}
            >
              <span className="material-icons mr-1">close</span>
              Missed
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full py-2 px-4 font-medium flex justify-center items-center"
            onClick={() => setShowDetails(true)}
          >
            <span className="material-icons mr-1">add_circle_outline</span>
            Add Details
          </Button>
          
          {showDetails && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Shot Result</label>
                <div className="grid grid-cols-3 gap-2">
                  {getShotResults().map(result => (
                    <Button
                      key={result}
                      variant={shotResult === result ? "default" : "outline"}
                      className="py-2 px-3 text-sm font-medium"
                      onClick={() => setShotResult(result)}
                    >
                      {result.charAt(0).toUpperCase() + result.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Shot Quality</label>
                <div className="flex space-x-2">
                  {getShotQualities().map((quality, index) => {
                    let bgColor = "bg-red-500";
                    if (quality === "ok") bgColor = "bg-yellow-500";
                    if (quality === "great") bgColor = "bg-secondary";
                    
                    return (
                      <Button
                        key={quality}
                        variant="outline"
                        className={`flex-1 py-2 px-3 ${shotQuality === quality ? bgColor + " text-white" : ""} text-sm font-medium`}
                        onClick={() => setShotQuality(quality)}
                      >
                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <Button
                className="w-full py-3 bg-primary text-white rounded-lg font-medium"
                disabled={!shotResult || !shotQuality}
                onClick={handleDetailedSubmit}
              >
                Save Shot
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Full shot recording form for the Shot Tracker tab
  return (
    <Card className="bg-white rounded-lg shadow-sm p-4">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading font-semibold text-base">Record New Shot</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Club Used</label>
          <select 
            className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
            value={selectedClub.name}
            onChange={(e) => {
              const selectedClubName = e.target.value;
              const club = clubs.find(c => c.name === selectedClubName);
              if (club) {
                // You'd need to handle this change in the parent component
                // This is just a placeholder
              }
            }}
          >
            {clubs.map(club => (
              <option key={club.id} value={club.name}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Shot Result</label>
          <div className="grid grid-cols-3 gap-2">
            {getShotResults().map(result => (
              <Button
                key={result}
                variant={shotResult === result ? "default" : "outline"}
                className="py-2 px-3 text-sm font-medium"
                onClick={() => setShotResult(result)}
              >
                {result.charAt(0).toUpperCase() + result.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Shot Quality</label>
          <div className="flex space-x-2">
            <Button
              variant={shotQuality === "poor" ? "destructive" : "outline"}
              className="flex-1 py-2 px-3 text-sm font-medium"
              onClick={() => setShotQuality("poor")}
            >
              Poor
            </Button>
            <Button
              variant="outline"
              className={`flex-1 py-2 px-3 text-sm font-medium ${shotQuality === "ok" ? "bg-yellow-500 text-white" : ""}`}
              onClick={() => setShotQuality("ok")}
            >
              OK
            </Button>
            <Button
              variant={shotQuality === "great" ? "secondary" : "outline"}
              className="flex-1 py-2 px-3 text-sm font-medium"
              onClick={() => setShotQuality("great")}
            >
              Great
            </Button>
          </div>
        </div>
        
        <Button
          className="w-full py-3 bg-primary text-white rounded-lg font-medium"
          disabled={!shotResult || !shotQuality}
          onClick={handleDetailedSubmit}
        >
          Save Shot
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShotRecording;
