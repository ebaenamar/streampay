"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Award } from "lucide-react";

type ScoreHistory = {
  date: string;
  score: number;
  improvements: string[];
};

export default function HealthScore() {
  const [currentScore, setCurrentScore] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading score data
    const loadScoreData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call to fetch user's score data
        // For demo purposes, we'll use mock data
        const mockScore = 72;
        const mockHistory: ScoreHistory[] = [
          {
            date: "2025-03-17",
            score: 72,
            improvements: ["Reduced sugar intake", "Added more vegetables"],
          },
          {
            date: "2025-03-10",
            score: 65,
            improvements: ["Increased protein intake", "Reduced fast food orders"],
          },
          {
            date: "2025-03-03",
            score: 58,
            improvements: ["Started tracking water intake", "Reduced processed foods"],
          },
          {
            date: "2025-02-25",
            score: 52,
            improvements: ["First week assessment"],
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setCurrentScore(mockScore);
        setScoreHistory(mockHistory);
      } catch (error) {
        console.error("Error loading score data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadScoreData();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = () => {
    if (scoreHistory.length < 2) return 0;
    const oldestScore = scoreHistory[scoreHistory.length - 1].score;
    const latestScore = scoreHistory[0].score;
    return latestScore - oldestScore;
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border">
      <div className="p-4 bg-primary text-white font-medium">
        <h2>Your Health Score</h2>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative">
                <div
                  className={`text-6xl font-bold ${getScoreColor(currentScore)}`}
                >
                  {currentScore}
                </div>
                <div className="text-gray-500 text-center mt-1">Health Score</div>
                <div className="absolute -top-2 -right-6">
                  <Trophy
                    className={`h-8 w-8 ${getScoreColor(currentScore)}`}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">
                  +{calculateProgress()} points
                </span>
                <span className="text-gray-500 ml-1">since you started</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 flex items-center">
                  <Award className="h-5 w-5 mr-1 text-primary" />
                  Current Level
                </h3>
                <div className="text-xl font-bold">
                  {currentScore >= 80
                    ? "Gold"
                    : currentScore >= 60
                    ? "Silver"
                    : "Bronze"}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {currentScore >= 80
                    ? "Excellent healthy habits!"
                    : currentScore >= 60
                    ? "Good progress, keep improving!"
                    : "You're on your way to better health!"}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Next Achievement</h3>
                <div className="text-xl font-bold">
                  {currentScore >= 80
                    ? "Platinum (90+)"
                    : currentScore >= 60
                    ? "Gold (80+)"
                    : "Silver (60+)"}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {currentScore >= 80
                    ? "Just 10 more points to reach Platinum!"
                    : currentScore >= 60
                    ? `${80 - currentScore} points to reach Gold level`
                    : `${60 - currentScore} points to reach Silver level`}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Dietitian Review</h3>
                <div className="text-sm text-gray-600">
                  Your dietitian will review your progress every week and provide personalized feedback.
                </div>
                <Button className="mt-2 w-full" size="sm">
                  Schedule Consultation
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Score History</h3>
              <div className="space-y-3">
                {scoreHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{formatDate(entry.date)}</div>
                      <div className="text-sm text-gray-600">
                        {entry.improvements.join(", ")}
                      </div>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        entry.score
                      )}`}
                    >
                      {entry.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
