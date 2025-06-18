import { Button } from "@/components/ui/button";
import { MapPinIcon } from "lucide-react";
import { useGolfRound } from "@/hooks/useGolfRound";
import { useQuery } from "@tanstack/react-query";

const CourseHeader = () => {
  const { round, currentHole } = useGolfRound();

  const { data: course } = useQuery({
    queryKey: ["/api/courses", round?.courseId],
    enabled: !!round?.courseId,
  });

  if (!course) {
    return (
      <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
        <p className="text-neutral-600">Loading course information...</p>
      </div>
    );
  }

  const holeData = course.data.holes.find(h => h.number === currentHole);

  return (
    <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-heading font-semibold text-lg">{course.name}</h2>
          <div className="flex items-center text-sm text-neutral-600">
            <MapPinIcon className="h-3 w-3 mr-1" />
            <span>
              Hole {currentHole} • Par {holeData?.par || '?'} • {holeData?.distance || '?'} yards
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <Button 
            variant="primary" 
            size="icon" 
            className="rounded-full"
            title="Update Location"
          >
            <span className="material-icons">add_location</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
