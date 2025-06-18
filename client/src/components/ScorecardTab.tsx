import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGolfRound } from "@/hooks/useGolfRound";
import { useQuery } from "@tanstack/react-query";
import { getScoreColorClass, formatRelativeToPar } from "@/lib/golfUtils";

const ScorecardTab = () => {
  const { round, updateRound } = useGolfRound();
  const [editingScore, setEditingScore] = useState<number | null>(null);
  const [editingPutts, setEditingPutts] = useState<number | null>(null);
  const [scoreValue, setScoreValue] = useState<number | string>("");
  const [puttsValue, setPuttsValue] = useState<number | string>("");
  
  const { data: course } = useQuery({
    queryKey: ["/api/courses", round?.courseId],
    enabled: !!round?.courseId,
  });
  
  if (!round || !course) {
    return <div>Loading scorecard...</div>;
  }
  
  const frontNine = Array.from({ length: 9 }, (_, i) => i + 1);
  const currentHole = round.currentHole;
  
  // Calculate current score
  const scores = round.scores || [];
  const validScores = scores.filter(score => score !== null && score !== undefined);
  const totalScore = validScores.reduce((sum, score) => sum + score, 0);
  
  // Calculate total par for played holes
  const parValues = course.data.holes.map(hole => hole.par);
  const parForPlayedHoles = parValues
    .slice(0, validScores.length)
    .reduce((sum, par) => sum + par, 0);
  
  // Calculate relative to par
  const relativeToPar = totalScore - parForPlayedHoles;
  const relativeToParText = formatRelativeToPar(relativeToPar);
  
  // Calculate stats
  const stats = round.stats || {
    fairwaysHit: 0,
    greensInRegulation: 0,
    putts: 0,
  };
  
  const fairwaysHitPercentage = stats.fairwaysHit > 0 
    ? Math.round((stats.fairwaysHit / validScores.length) * 100) 
    : 0;
  
  const greensInRegulationPercentage = stats.greensInRegulation > 0
    ? Math.round((stats.greensInRegulation / validScores.length) * 100)
    : 0;
  
  const avgPutts = stats.putts > 0
    ? (stats.putts / validScores.length).toFixed(1)
    : 0;
  
  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setScoreValue(value === "" ? "" : parseInt(value));
  };
  
  const handlePuttsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPuttsValue(value === "" ? "" : parseInt(value));
  };
  
  const saveScore = (holeIndex: number) => {
    if (scoreValue === "") return;
    
    const newScores = [...scores];
    newScores[holeIndex] = Number(scoreValue);
    
    // Update putts if we're editing those as well
    let newStats = { ...stats };
    if (puttsValue !== "") {
      const oldPutts = round.stats.putts || 0;
      const oldHolePutts = stats.puttsPerHole?.[holeIndex] || 0;
      newStats = {
        ...stats,
        putts: oldPutts - oldHolePutts + Number(puttsValue),
        puttsPerHole: {
          ...stats.puttsPerHole,
          [holeIndex]: Number(puttsValue)
        }
      };
    }
    
    updateRound({
      scores: newScores,
      stats: newStats
    });
    
    setEditingScore(null);
    setEditingPutts(null);
    setScoreValue("");
    setPuttsValue("");
  };
  
  return (
    <div>
      <Card className="bg-white rounded-lg shadow-sm mb-4">
        <CardHeader className="p-4 border-b">
          <CardTitle className="font-heading font-semibold">Today's Round</CardTitle>
          <p className="text-sm text-neutral-600">
            {course.name} • {new Date().toLocaleDateString()}
          </p>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-neutral-50">
                <th className="py-2 px-3 text-left text-xs font-medium text-neutral-600">Hole</th>
                {frontNine.map(hole => (
                  <th key={hole} className="py-2 px-3 text-center text-xs font-medium text-neutral-600">
                    {hole}
                  </th>
                ))}
                <th className="py-2 px-3 text-center text-xs font-medium text-neutral-600">OUT</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-200">
                <td className="py-2 px-3 text-left text-xs font-medium text-neutral-600">Par</td>
                {frontNine.map(hole => (
                  <td key={hole} className="py-2 px-3 text-center text-xs">
                    {course.data.holes[hole - 1]?.par || "-"}
                  </td>
                ))}
                <td className="py-2 px-3 text-center text-xs font-medium">
                  {parValues.slice(0, 9).reduce((sum, par) => sum + par, 0)}
                </td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="py-2 px-3 text-left text-xs font-medium text-neutral-600">Score</td>
                {frontNine.map((hole, index) => {
                  const isCurrentlyEditing = editingScore === index;
                  const score = scores[index];
                  const par = course.data.holes[index]?.par || 0;
                  const colorClass = getScoreColorClass(score, par);
                  
                  return (
                    <td 
                      key={hole}
                      className={`py-2 px-3 text-center text-xs ${!isCurrentlyEditing && score ? colorClass : "bg-neutral-100"}`}
                      onClick={() => {
                        if (hole <= currentHole) {
                          setEditingScore(index);
                          setScoreValue(score || "");
                        }
                      }}
                    >
                      {isCurrentlyEditing ? (
                        <input
                          type="number"
                          className="w-8 text-center"
                          value={scoreValue}
                          onChange={handleScoreChange}
                          onBlur={() => saveScore(index)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") saveScore(index);
                          }}
                          autoFocus
                        />
                      ) : (
                        score || "-"
                      )}
                    </td>
                  );
                })}
                <td className="py-2 px-3 text-center text-xs font-medium">
                  {validScores.slice(0, 9).reduce((sum, score) => sum + score, 0) || "-"}
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-left text-xs font-medium text-neutral-600">Putts</td>
                {frontNine.map((hole, index) => {
                  const isCurrentlyEditing = editingPutts === index;
                  const putts = stats.puttsPerHole?.[index] || 0;
                  
                  return (
                    <td 
                      key={hole}
                      className="py-2 px-3 text-center text-xs"
                      onClick={() => {
                        if (hole <= currentHole && scores[index]) {
                          setEditingPutts(index);
                          setPuttsValue(putts || "");
                        }
                      }}
                    >
                      {isCurrentlyEditing ? (
                        <input
                          type="number"
                          className="w-8 text-center"
                          value={puttsValue}
                          onChange={handlePuttsChange}
                          onBlur={() => saveScore(index)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") saveScore(index);
                          }}
                          autoFocus
                        />
                      ) : (
                        putts || "-"
                      )}
                    </td>
                  );
                })}
                <td className="py-2 px-3 text-center text-xs font-medium">
                  {stats.putts || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between">
            <div>
              <div className="text-sm text-neutral-600">Current Score</div>
              <div className="text-lg font-medium">
                {relativeToParText} through {validScores.length} holes
              </div>
            </div>
            <Button 
              className="py-2 px-4 bg-primary text-white rounded-lg font-medium text-sm"
              onClick={() => setEditingScore(currentHole - 1)}
            >
              Update Score
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Stats Summary */}
      <Card className="bg-white rounded-lg shadow-sm p-4">
        <CardHeader className="pb-2">
          <CardTitle className="font-heading font-semibold text-base">Round Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-neutral-600">Fairways Hit</div>
              <div className="text-xl font-medium">{stats.fairwaysHit}/{validScores.length}</div>
              <div className="text-xs text-neutral-500">{fairwaysHitPercentage}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-neutral-600">Greens in Reg</div>
              <div className="text-xl font-medium">{stats.greensInRegulation}/{validScores.length}</div>
              <div className="text-xs text-neutral-500">{greensInRegulationPercentage}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-neutral-600">Avg Putts</div>
              <div className="text-xl font-medium">{avgPutts}</div>
              <div className="text-xs text-neutral-500">per hole</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScorecardTab;
