import { useState, useEffect } from 'react';

export interface GolfRound {
  id: string;
  courseId: string;
  courseName: string;
  currentHole: number;
  totalHoles: number;
  score: number;
  par: number;
  startTime: Date;
}

export function useGolfRound() {
  const [currentRound, setCurrentRound] = useState<GolfRound | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading a golf round
    const loadRound = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data for now
        setCurrentRound({
          id: '1',
          courseId: '1',
          courseName: 'Pebble Beach Golf Links',
          currentHole: 1,
          totalHoles: 18,
          score: 0,
          par: 72,
          startTime: new Date(),
        });
      } catch (error) {
        console.error('Failed to load golf round:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRound();
  }, []);

  const updateHole = (hole: number) => {
    if (currentRound) {
      setCurrentRound({ ...currentRound, currentHole: hole });
    }
  };

  const updateScore = (score: number) => {
    if (currentRound) {
      setCurrentRound({ ...currentRound, score });
    }
  };

  return {
    currentRound,
    isLoading,
    updateHole,
    updateScore,
  };
}
