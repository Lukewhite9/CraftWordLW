import React, { useEffect, useState } from 'react';

type Score = {
  name: string;
  score: number;
};

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('https://back-end.lukewhite9.repl.co/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setScores(data);
        } else {
          console.error('Failed to retrieve leaderboard scores');
        }
      } catch (error) {
        console.error('Error retrieving leaderboard scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div>
      {scores.map((score, index) => (
        <div key={index}>
          <h2>{score.name}: {score.score} points</h2>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
