import { useRef, useEffect, useState } from "react";
import { Position } from "@shared/schema";
import { cn } from "@/lib/utils";

type CourseMapProps = {
  className?: string;
  holePosition: Position;
  currentPosition: Position | null;
  shots?: Array<{
    startPosition: Position;
    endPosition: Position;
  }>;
  onPositionUpdate?: (position: Position) => void;
  interactive?: boolean;
  hazards?: Array<{
    type: string;
    position: Position;
    size: { width: number; height: number };
    shape: string;
  }>;
};

const CourseMap = ({
  className,
  holePosition,
  currentPosition,
  shots = [],
  onPositionUpdate,
  interactive = true,
  hazards = [],
}: CourseMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (mapRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      });
      
      resizeObserver.observe(mapRef.current);
      
      return () => {
        if (mapRef.current) resizeObserver.unobserve(mapRef.current);
      };
    }
  }, []);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !mapRef.current || !onPositionUpdate) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    onPositionUpdate({ x, y });
  };

  return (
    <div 
      ref={mapRef}
      className={cn(
        "course-map relative bg-green-100 rounded-lg overflow-hidden",
        className
      )}
      style={{ aspectRatio: "3/2" }}
      onClick={handleMapClick}
    >
      {/* Green area representation */}
      <div 
        className="absolute bg-secondary-light rounded-full opacity-70"
        style={{ 
          top: `${holePosition.y - 7.5}%`, 
          left: `${holePosition.x - 7.5}%`, 
          width: "15%", 
          height: "15%" 
        }}
      />
      
      {/* Fairway representation */}
      <div 
        className="absolute bg-secondary-light opacity-40 transform -rotate-6"
        style={{ 
          top: "40%", 
          left: "20%", 
          width: "60%", 
          height: "25%" 
        }}
      />
      
      {/* Render hazards */}
      {hazards.map((hazard, index) => {
        if (hazard.type === 'sand') {
          return (
            <div
              key={`hazard-${index}`}
              className="absolute bg-yellow-200 rounded-full"
              style={{
                top: `${hazard.position.y - hazard.size.height / 2}%`,
                left: `${hazard.position.x - hazard.size.width / 2}%`,
                width: `${hazard.size.width}%`,
                height: `${hazard.size.height}%`
              }}
            />
          );
        } else if (hazard.type === 'water') {
          return (
            <div
              key={`hazard-${index}`}
              className="absolute bg-blue-300 rounded-lg"
              style={{
                top: `${hazard.position.y - hazard.size.height / 2}%`,
                left: `${hazard.position.x - hazard.size.width / 2}%`,
                width: `${hazard.size.width}%`,
                height: `${hazard.size.height}%`
              }}
            />
          );
        }
        return null;
      })}
      
      {/* Hole position */}
      <div
        className="hole"
        style={{
          top: `${holePosition.y}%`,
          left: `${holePosition.x}%`,
        }}
      />
      
      {/* Current position */}
      {currentPosition && (
        <div
          className="current-position"
          style={{
            top: `${currentPosition.y}%`,
            left: `${currentPosition.x}%`,
          }}
        />
      )}
      
      {/* Shot path visualization */}
      {shots.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {shots.map((shot, index) => (
            <path
              key={`shot-path-${index}`}
              className="shot-track-line"
              d={`M${shot.startPosition.x},${shot.startPosition.y} L${shot.endPosition.x},${shot.endPosition.y}`}
              fill="none"
            />
          ))}
          
          {shots.map((shot, index) => (
            <circle
              key={`shot-marker-${index}`}
              cx={shot.endPosition.x}
              cy={shot.endPosition.y}
              r="5"
              fill="#3b82f6"
            />
          ))}
        </svg>
      )}
    </div>
  );
};

export default CourseMap;
