import { Position, ClubType, Shot, Club, ShotResult, ShotQuality } from "@shared/schema";

/**
 * Calculate distance between two points in 2D space
 */
export const calculateDistance = (start: Position, end: Position): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Convert pixel distance to yards based on a scale factor
 */
export const pixelsToYards = (pixelDistance: number, scale: number = 1): number => {
  return Math.round(pixelDistance * scale);
};

/**
 * Convert yards to pixels based on a scale factor
 */
export const yardsToPixels = (yards: number, scale: number = 1): number => {
  return yards / scale;
};

/**
 * Recommend clubs based on distance
 */
export const recommendClubs = (clubs: Club[], distance: number): Club[] => {
  if (!clubs || clubs.length === 0) return [];
  
  // Filter out putter and sort clubs by how close their average distance is to the target
  return [...clubs]
    .filter(club => club.averageDistance > 0) // Exclude putter
    .sort((a, b) => {
      const aDiff = Math.abs(a.averageDistance - distance);
      const bDiff = Math.abs(b.averageDistance - distance);
      return aDiff - bDiff;
    })
    .slice(0, 3); // Return top 3 recommendations
};

/**
 * Get club by name
 */
export const getClubByName = (clubs: Club[], name: string): Club | undefined => {
  return clubs.find(club => club.name === name);
};

/**
 * Generate shot strategy based on distance and conditions
 */
export const generateShotStrategy = (
  distance: number, 
  windSpeed: number = 0, 
  windDirection: string = "none",
  hazards: string[] = []
): string => {
  let strategy = "";
  
  // Base strategy based on distance
  if (distance > 200) {
    strategy = "Focus on accuracy rather than distance. Take a smooth swing.";
  } else if (distance > 150) {
    strategy = "Aim directly at the pin with a controlled swing.";
  } else if (distance > 100) {
    strategy = "Attack the pin. This is a scoring opportunity.";
  } else {
    strategy = "Focus on distance control for this approach shot.";
  }
  
  // Adjust for wind
  if (windSpeed > 10) {
    if (windDirection.includes("left")) {
      strategy += " Aim slightly right of the pin to account for the left-to-right wind.";
    } else if (windDirection.includes("right")) {
      strategy += " Aim slightly left of the pin to account for the right-to-left wind.";
    } else if (windDirection.includes("head")) {
      strategy += " Club up to counter the headwind.";
    } else if (windDirection.includes("tail")) {
      strategy += " Consider clubbing down with the tailwind.";
    }
  } else if (windSpeed > 5) {
    strategy += " Take the mild wind into consideration.";
  }
  
  // Adjust for hazards
  if (hazards.includes("water")) {
    strategy += " Avoid the water hazard by aiming away from it.";
  }
  if (hazards.includes("bunker")) {
    strategy += " Be cautious of the bunkers protecting the green.";
  }
  if (hazards.includes("ob")) {
    strategy += " Play conservatively to avoid the out of bounds area.";
  }
  
  return strategy;
};

/**
 * Calculate adjusted distance based on elevation and wind
 */
export const calculateAdjustedDistance = (
  actualDistance: number,
  elevationPercent: number = 0,
  windSpeedMph: number = 0,
  windDirection: string = "none"
): number => {
  // Adjust for elevation (approximately 2 yards per percent of elevation change)
  let adjustedDistance = actualDistance;
  adjustedDistance += (elevationPercent * 2);
  
  // Adjust for wind (approximately 1 yard per 1 mph of wind)
  if (windDirection.includes("head")) {
    adjustedDistance += windSpeedMph;
  } else if (windDirection.includes("tail")) {
    adjustedDistance -= windSpeedMph;
  }
  
  return Math.round(adjustedDistance);
};

/**
 * Format distance with units
 */
export const formatDistance = (distance: number, unit: string = "yards"): string => {
  return `${distance} ${unit}`;
};

/**
 * Get an array of common club names
 */
export const getCommonClubs = (): string[] => {
  return [
    "Driver",
    "3 Wood",
    "5 Wood",
    "3 Hybrid",
    "4 Hybrid",
    "4 Iron",
    "5 Iron",
    "6 Iron",
    "7 Iron",
    "8 Iron",
    "9 Iron",
    "PW",
    "GW",
    "SW",
    "LW",
    "Putter"
  ];
};

/**
 * Get an array of shot results
 */
export const getShotResults = (): ShotResult[] => {
  return ["fairway", "green", "rough", "sand", "water", "ob"];
};

/**
 * Get an array of shot qualities
 */
export const getShotQualities = (): ShotQuality[] => {
  return ["poor", "ok", "great"];
};

/**
 * Calculate score relative to par
 */
export const calculateRelativeToPar = (score: number, par: number): number => {
  return score - par;
};

/**
 * Format score relative to par as a string
 */
export const formatRelativeToPar = (relativeToPar: number): string => {
  if (relativeToPar === 0) return "E";
  return relativeToPar > 0 ? `+${relativeToPar}` : `${relativeToPar}`;
};

/**
 * Get color class for score relative to par
 */
export const getScoreColorClass = (score: number, par: number): string => {
  const diff = score - par;
  if (diff < 0) return "bg-green-50 text-green-700"; // Under par
  if (diff === 0) return "bg-neutral-50 text-neutral-700"; // Par
  if (diff === 1) return "bg-red-50 text-red-700"; // Bogey
  return "bg-red-100 text-red-800"; // Double bogey or worse
};
