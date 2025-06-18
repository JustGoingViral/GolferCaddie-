
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SatelliteData {
  hole_layout: {
    length: number;
    width_variations: Array<{
      distance_from_tee: number;
      width_yards: number;
      difficulty: string;
    }>;
    dogleg: {
      type: string;
      severity: string;
      optimal_turn_point: number;
    };
    elevation_changes: {
      overall_change: string;
      playing_effect: string;
    };
  };
  hazards: {
    water_hazards: Array<{
      type: string;
      location: string;
      distance_from_tee: number;
      carry_required: number;
    }>;
    bunkers: Array<{
      location: string;
      distance_from_tee: number;
      size: string;
    }>;
  };
  strategic_zones: {
    optimal_landing_areas: Array<{
      distance_range: string;
      width: string;
      advantage: string;
      risk_level: string;
    }>;
  };
}

interface Props {
  courseId: string;
  holeNumber: number;
  onStrategySelect?: (strategy: string) => void;
}

export default function SatelliteHoleView({ courseId, holeNumber, onStrategySelect }: Props) {
  const [satelliteData, setSatelliteData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  useEffect(() => {
    fetchSatelliteData();
  }, [courseId, holeNumber]);

  const fetchSatelliteData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/course-ai/course-satellite/${courseId}/${holeNumber}`);
      const data = await response.json();
      setSatelliteData(data.satellite_analysis);
    } catch (error) {
      console.error('Error fetching satellite data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading satellite imagery analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!satelliteData) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">No satellite data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Hole Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-primary">satellite</span>
            Hole {holeNumber} - Satellite Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Length</p>
              <p className="text-lg font-semibold">{satelliteData.hole_layout.length} yards</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Elevation</p>
              <p className="text-lg font-semibold">{satelliteData.hole_layout.elevation_changes.overall_change}</p>
            </div>
          </div>
          
          {satelliteData.hole_layout.dogleg && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">
                {satelliteData.hole_layout.dogleg.severity} {satelliteData.hole_layout.dogleg.type} dogleg
              </p>
              <p className="text-sm text-blue-700">
                Optimal turn point: {satelliteData.hole_layout.dogleg.optimal_turn_point} yards
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategic Landing Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Strategic Landing Zones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {satelliteData.strategic_zones.optimal_landing_areas.map((zone, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedZone === zone.distance_range 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedZone(zone.distance_range);
                  onStrategySelect?.(`target_${zone.distance_range}`);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{zone.distance_range} yards</p>
                    <p className="text-sm text-gray-600">{zone.advantage}</p>
                    <p className="text-xs text-gray-500">Landing area: {zone.width}</p>
                  </div>
                  <Badge className={getRiskColor(zone.risk_level)}>
                    {zone.risk_level} risk
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hazards Map */}
      <Card>
        <CardHeader>
          <CardTitle>Hazards & Obstacles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Water Hazards */}
            {satelliteData.hazards.water_hazards?.map((hazard, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="material-icons text-blue-600">water</span>
                <div className="flex-1">
                  <p className="font-medium text-blue-900">{hazard.type}</p>
                  <p className="text-sm text-blue-700">
                    {hazard.location} - {hazard.distance_from_tee} yards from tee
                  </p>
                  <p className="text-xs text-blue-600">
                    Carry required: {hazard.carry_required} yards
                  </p>
                </div>
              </div>
            ))}

            {/* Sand Bunkers */}
            {satelliteData.hazards.bunkers?.map((bunker, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <span className="material-icons text-yellow-600">landscape</span>
                <div className="flex-1">
                  <p className="font-medium text-yellow-900">Sand Bunker</p>
                  <p className="text-sm text-yellow-700">
                    {bunker.location} - {bunker.distance_from_tee} yards from tee
                  </p>
                  <p className="text-xs text-yellow-600">
                    Size: {bunker.size}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fairway Width Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Fairway Width Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {satelliteData.hole_layout.width_variations.map((variation, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <span className="text-sm">
                  {variation.distance_from_tee} yards from tee
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {variation.width_yards} yards wide
                  </span>
                  <Badge 
                    variant={variation.difficulty === 'generous' ? 'default' : 
                            variation.difficulty === 'moderate' ? 'secondary' : 'destructive'}
                  >
                    {variation.difficulty}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => onStrategySelect?.('satellite_optimized')}
        className="w-full"
      >
        Use Satellite-Optimized Strategy
      </Button>
    </div>
  );
}
