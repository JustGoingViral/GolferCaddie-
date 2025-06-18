
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PlayerHistory {
  rounds_played: number;
  average_score: number;
  preferred_strategy: string;
  trouble_patterns: string[];
  improvement_trend: string;
}

interface Props {
  playerId: string;
  courseId: string;
  holeNumber: number;
}

export default function PlayerMemoryInsights({ playerId, courseId, holeNumber }: Props) {
  const [playerHistory, setPlayerHistory] = useState<PlayerHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerHistory();
  }, [playerId, courseId, holeNumber]);

  const fetchPlayerHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/course-ai/player-history/${playerId}/${courseId}/${holeNumber}`);
      const data = await response.json();
      setPlayerHistory(data.history);
    } catch (error) {
      console.error('Error fetching player history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < -0.5) return 'text-green-600';
    if (score < 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreText = (score: number) => {
    if (score < -1) return 'Excellent';
    if (score < -0.5) return 'Good';
    if (score < 0.5) return 'Average';
    return 'Needs Work';
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return 'trending_up';
      case 'stable': return 'trending_flat';
      case 'declining': return 'trending_down';
      default: return 'help';
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm">Loading your performance history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!playerHistory || playerHistory.rounds_played === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-primary">psychology</span>
            Your Hole History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <span className="material-icons text-4xl mb-2 block">history</span>
            <p>No previous rounds on this hole</p>
            <p className="text-sm">Your performance will be tracked for future insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="material-icons text-primary">psychology</span>
          Your Hole History - {playerHistory.rounds_played} rounds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Average Score</p>
            <p className={`text-2xl font-bold ${getScoreColor(playerHistory.average_score)}`}>
              {playerHistory.average_score > 0 ? '+' : ''}{playerHistory.average_score.toFixed(1)}
            </p>
            <p className={`text-xs ${getScoreColor(playerHistory.average_score)}`}>
              {getScoreText(playerHistory.average_score)}
            </p>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Trend</p>
            <div className="flex items-center justify-center gap-1">
              <span className={`material-icons ${getTrendColor(playerHistory.improvement_trend)}`}>
                {getTrendIcon(playerHistory.improvement_trend)}
              </span>
              <p className={`text-sm font-medium capitalize ${getTrendColor(playerHistory.improvement_trend)}`}>
                {playerHistory.improvement_trend}
              </p>
            </div>
          </div>
        </div>

        {/* Preferred Strategy */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Your Preferred Strategy</p>
          <Badge variant="outline" className="capitalize">
            {playerHistory.preferred_strategy.replace('_', ' ')}
          </Badge>
        </div>

        {/* Trouble Patterns */}
        {playerHistory.trouble_patterns && playerHistory.trouble_patterns.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Watch Out For</p>
            <div className="space-y-2">
              {playerHistory.trouble_patterns.map((pattern, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                  <span className="material-icons text-red-500 text-sm">warning</span>
                  <span className="text-sm text-red-700">{pattern}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Progress */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Performance Progress</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Consistency</span>
              <span>{Math.min(100, Math.max(0, 100 - (Math.abs(playerHistory.average_score) * 30)))}%</span>
            </div>
            <Progress 
              value={Math.min(100, Math.max(0, 100 - (Math.abs(playerHistory.average_score) * 30)))} 
              className="h-2"
            />
          </div>
        </div>

        {/* Personalized Tips */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start gap-2">
            <span className="material-icons text-blue-600 text-sm mt-0.5">lightbulb</span>
            <div>
              <p className="text-sm font-medium text-blue-900">Personal Insight</p>
              <p className="text-xs text-blue-700">
                {playerHistory.improvement_trend === 'improving' 
                  ? "You're getting better on this hole! Keep using your current approach."
                  : playerHistory.improvement_trend === 'declining'
                  ? "Consider trying a different strategy - your usual approach isn't working lately."
                  : "Your performance is steady. Focus on consistency and course management."
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
