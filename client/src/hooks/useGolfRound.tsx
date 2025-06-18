import React, { useState, useCallback, createContext, useContext, ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Round, Shot, Position, Club, HoleData, ShotResult, ShotQuality } from "@shared/schema";

interface GolfRoundContextType {
  round: Round | null;
  currentHole: number;
  currentPosition: Position | null;
  shots: Shot[];
  clubs: Club[];
  createNewRound: (courseId: number) => void;
  updateRound: (data: Partial<Round>) => void;
  setCurrentHole: (holeNumber: number) => void;
  setCurrentPosition: (position: Position) => void;
  recordShot: (shotData: {
    club: string;
    endPosition: Position;
    result: ShotResult;
    quality: ShotQuality;
    notes?: string;
  }) => void;
  calculateDistanceToHole: () => number;
  getCurrentHoleData: () => HoleData | undefined;
  isLoading: boolean;
}

const GolfRoundContext = createContext<GolfRoundContextType | undefined>(undefined);

// Default data for initial setup
const defaultTeePosition: Position = { x: 10, y: 85 };
const defaultHolePosition: Position = { x: 80, y: 25 };

export const GolfRoundProvider = ({ children }: { children: ReactNode }) => {
  const [round, setRound] = useState<Round | null>(null);
  const [currentHole, setCurrentHole] = useState<number>(1);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(defaultTeePosition);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get course data
  const { data: courses = [] } = useQuery({
    queryKey: ["/api/courses"],
  });
  
  // Get user's clubs
  const { data: clubs = [] } = useQuery({
    queryKey: ["/api/users/1/clubs"], // Using a default user ID for now
  });
  
  // Get shots (empty array if no round exists)
  const { data: shots = [] } = useQuery({
    queryKey: ["/api/rounds", round?.id, "holes", currentHole, "shots"],
    enabled: !!round?.id,
  });
  
  // Course data for the current round
  const { data: courseData, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["/api/courses", round?.courseId || (courses[0]?.id || 1)],
  });
  
  const createRoundMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/rounds", data);
      return res.json();
    },
    onSuccess: (data) => {
      setRound(data);
      setCurrentHole(1);
      toast({
        title: "Round Created",
        description: "Your golf round has been started successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create round: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  const updateRoundMutation = useMutation({
    mutationFn: async (data: Partial<Round>) => {
      if (!round?.id) throw new Error("No active round");
      const res = await apiRequest("PATCH", `/api/rounds/${round.id}`, data);
      return res.json();
    },
    onSuccess: (data) => {
      setRound(data);
      queryClient.invalidateQueries({ queryKey: ["/api/rounds", round?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update round: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  const recordShotMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/shots", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["/api/rounds", round?.id, "holes", currentHole, "shots"] 
      });
      toast({
        title: "Shot Recorded",
        description: "Your shot has been recorded successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record shot: " + (error as Error).message,
        variant: "destructive"
      });
    }
  });
  
  const createNewRound = useCallback((courseId: number) => {
    // Initialize a new round with default values
    const newRoundData = {
      userId: 1, // Default user ID
      courseId,
      date: new Date().toISOString().split('T')[0],
      completed: false,
      currentHole: 1,
      scores: Array(18).fill(null),
      stats: {
        fairwaysHit: 0,
        greensInRegulation: 0,
        putts: 0,
      }
    };
    
    createRoundMutation.mutate(newRoundData);
  }, [createRoundMutation]);
  
  const updateRound = useCallback((data: Partial<Round>) => {
    updateRoundMutation.mutate(data);
  }, [updateRoundMutation]);
  
  const recordShot = useCallback((shotData: {
    club: string;
    endPosition: Position;
    result: ShotResult;
    quality: ShotQuality;
    notes?: string;
  }) => {
    if (!round?.id || !currentPosition) {
      toast({
        title: "Error",
        description: "Cannot record shot: No active round or current position not set",
        variant: "destructive"
      });
      return;
    }
    
    const newShot = {
      roundId: round.id,
      holeNumber: currentHole,
      shotNumber: (shots as any).length + 1,
      club: shotData.club,
      startPosition: currentPosition,
      endPosition: shotData.endPosition,
      result: shotData.result,
      quality: shotData.quality,
      notes: shotData.notes || "",
    };
    
    recordShotMutation.mutate(newShot);
    
    // Update current position to the end position of this shot
    setCurrentPosition(shotData.endPosition);
  }, [round?.id, currentHole, currentPosition, shots, recordShotMutation, toast]);
  
  const calculateDistanceToHole = useCallback((): number => {
    if (!currentPosition) return 250; // Default distance
    
    // Use default hole position if courseData is not available
    const holePosition = courseData?.data?.holes?.find(h => h.number === currentHole)?.holePosition || defaultHolePosition;
    
    // Calculate Euclidean distance
    const dx = holePosition.x - currentPosition.x;
    const dy = holePosition.y - currentPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Convert to yards (assuming a reasonable scale)
    const scale = 3; // 1 unit in our coordinate system equals 3 yards
    return Math.round(distance * scale);
  }, [currentPosition, courseData, currentHole]);
  
  const getCurrentHoleData = useCallback((): HoleData | undefined => {
    if (!courseData?.data?.holes) return undefined;
    return courseData.data.holes.find(h => h.number === currentHole);
  }, [courseData, currentHole]);
  
  const isLoading = isLoadingCourse;
  
  const value = {
    round,
    currentHole,
    currentPosition,
    shots: shots as Shot[],
    clubs: clubs as Club[],
    createNewRound,
    updateRound,
    setCurrentHole,
    setCurrentPosition,
    recordShot,
    calculateDistanceToHole,
    getCurrentHoleData,
    isLoading
  };
  
  return (
    <GolfRoundContext.Provider value={value}>
      {children}
    </GolfRoundContext.Provider>
  );
};

export const useGolfRound = () => {
  const context = useContext(GolfRoundContext);
  if (context === undefined) {
    throw new Error("useGolfRound must be used within a GolfRoundProvider");
  }
  return context;
};

// Default export that includes the provider for easy importing
export default function GolfRoundState({ children }: { children: ReactNode }) {
  return <GolfRoundProvider>{children}</GolfRoundProvider>;
}
