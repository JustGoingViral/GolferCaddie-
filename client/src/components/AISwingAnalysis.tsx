import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AISwingAnalysis() {
  const [videoUrl, setVideoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = () => {
    // In a real app, you would upload the video to your server or cloud storage
    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        // Start analysis after upload completes
        analyzeSwing();
      }
    }, 300);
  };

  const analyzeSwing = () => {
    // In a real app, this would call your AI backend to analyze the swing
    setAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const generatedAnalysis = generateMockAnalysis();
      setAnalysis(generatedAnalysis);
      setAnalyzing(false);
    }, 3000);
  };

  const generateMockAnalysis = () => {
    // In a real app, this would be replaced with actual AI analysis results
    const swingPhases = [
      {
        name: "Setup",
        score: Math.floor(Math.random() * 30) + 70, // 70-100
        feedback: "Your stance is stable with good alignment. Try widening your stance slightly for more stability."
      },
      {
        name: "Takeaway",
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Good tempo on takeaway. The clubface remains square but your wrists could be slightly more firm."
      },
      {
        name: "Backswing",
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Good shoulder rotation. Try to maintain better posture by keeping your spine angle consistent."
      },
      {
        name: "Transition",
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Your weight shift is smooth. Try initiating the downswing with your lower body before your arms."
      },
      {
        name: "Downswing",
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Good hip rotation. Your clubhead path could be more inside-out for better ball striking."
      },
      {
        name: "Impact",
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Solid contact position. Try to maintain better wrist angles through impact for more consistency."
      },
      {
        name: "Follow-through",
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Good balance through finish. Try to complete your rotation more fully for better power transfer."
      }
    ];
    
    // Calculate overall score
    const overallScore = Math.floor(
      swingPhases.reduce((total, phase) => total + phase.score, 0) / swingPhases.length
    );
    
    // Generate overall summary based on score
    let summary = "";
    let proComparison = "";
    let keyImprovements = [];
    
    if (overallScore >= 90) {
      summary = "Excellent swing mechanics with professional-level consistency. Minor tweaks could still improve performance.";
      proComparison = "Your swing has similarities to Rory McIlroy with your fluid tempo and powerful rotation.";
      keyImprovements = ["Fine-tune impact position for more consistent strikes", "Optimize weight transfer for maximum power"];
    } else if (overallScore >= 80) {
      summary = "Very good swing with solid fundamentals. A few adjustments could lead to more consistency and power.";
      proComparison = "Your swing resembles Justin Thomas with your athletic movement, though with room for improved transition.";
      keyImprovements = ["Improve transition from backswing to downswing", "Enhance clubface control through impact"];
    } else {
      summary = "Good foundational swing with several areas for improvement. Focus on key fundamentals to build consistency.";
      proComparison = "Your swing has elements similar to Jordan Spieth with your rhythm, though needs work on sequencing.";
      keyImprovements = ["Stabilize setup and posture", "Develop more consistent tempo", "Improve body rotation sequence"];
    }
    
    return {
      overallScore,
      summary,
      proComparison,
      keyImprovements,
      swingPhases,
      recommendedDrills: [
        "Alignment rod drills for setup and path",
        "Tempo training with metronome",
        "Half-swing practice for better transition"
      ]
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    return "text-amber-600";
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const renderScoreGauge = (score: number) => {
    return (
      <div className="relative h-32 w-32 mx-auto mb-4">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          
          {/* Progress arc - stroke-dasharray and stroke-dashoffset to create the arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={score >= 90 ? "#16a34a" : score >= 80 ? "#2563eb" : "#d97706"}
            strokeWidth="10"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * score / 100)}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          
          {/* Score text */}
          <text
            x="50"
            y="55"
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
            fill="#374151"
          >
            {score}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="font-semibold text-base">AI Swing Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis && !analyzing && !uploading ? (
          <div>
            <p className="text-sm text-neutral-600 mb-4">
              Upload a video of your swing for AI-powered analysis and personalized feedback.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Video URL or Upload
              </label>
              <Input
                type="text"
                placeholder="Paste video URL or YouTube link"
                value={videoUrl}
                onChange={handleVideoInputChange}
                className="mb-2"
              />
              <div className="flex items-center">
                <div className="relative w-full">
                  <input
                    type="file"
                    accept="video/*"
                    className="absolute inset-0 opacity-0 w-full cursor-pointer"
                    onChange={() => handleUpload()}
                  />
                  <Button variant="outline" className="w-full justify-center">
                    <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                      <line x1="16" y1="5" x2="22" y2="5" />
                      <line x1="19" y1="2" x2="19" y2="8" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    Choose Video File
                  </Button>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!videoUrl} 
              onClick={handleUpload}
            >
              <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 7-9-5-9 5v10l9 5 9-5Z" />
                <path d="m3 7 9 5 9-5" />
                <path d="M12 22V12" />
              </svg>
              Analyze My Swing
            </Button>
          </div>
        ) : uploading ? (
          <div className="py-8">
            <div className="mb-4 text-center">
              <svg className="h-12 w-12 text-green-600 mx-auto mb-3 animate-pulse" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                <line x1="16" y1="5" x2="22" y2="5" />
                <line x1="19" y1="2" x2="19" y2="8" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <p className="text-neutral-600 mb-2">Uploading video...</p>
            </div>
            
            <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            
            <p className="text-sm text-neutral-500 text-center">
              {uploadProgress}% complete
            </p>
          </div>
        ) : analyzing ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-neutral-600 mb-2">Analyzing your swing...</p>
            <p className="text-sm text-neutral-500">
              Our AI is examining your swing mechanics, comparing with pro golfers, and generating personalized feedback
            </p>
          </div>
        ) : analysis ? (
          <div>
            <div className="text-center mb-6">
              {renderScoreGauge(analysis.overallScore)}
              <h3 className="font-semibold text-lg">Overall Swing Rating</h3>
              <p className={`${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore >= 90 ? "Excellent" : 
                 analysis.overallScore >= 80 ? "Very Good" : "Good"}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Swing Analysis</h3>
              <p className="text-sm text-neutral-600 mb-3">{analysis.summary}</p>
              <p className="text-sm text-neutral-600 italic">{analysis.proComparison}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Swing Phase Breakdown</h3>
              <div className="space-y-3">
                {analysis.swingPhases.map((phase: any, idx: number) => (
                  <div key={idx} className="bg-neutral-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium">{phase.name}</div>
                      <div className={`font-medium ${getScoreColor(phase.score)}`}>{phase.score}/100</div>
                    </div>
                    <p className="text-xs text-neutral-600">{phase.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Key Improvements</h3>
              <ul className="list-disc list-inside text-sm text-neutral-600">
                {analysis.keyImprovements.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Recommended Drills</h3>
              <ul className="list-disc list-inside text-sm text-neutral-600">
                {analysis.recommendedDrills.map((drill: string, idx: number) => (
                  <li key={idx}>{drill}</li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setAnalysis(null);
                  setVideoUrl('');
                }}
              >
                Analyze Another Swing
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}