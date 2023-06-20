import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Input,
} from '@chakra-ui/react';

type GameOverModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalScore: number;
  totalTime: number;
};

type Score = {
  name: string;
  score: number;
  time: number;
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  totalScore,
  totalTime,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://back-end.lukewhite9.repl.co/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName.trim(),
          score: totalScore,
          time: totalTime,
        }),
      });

      if (response.ok) {
        // High score saved successfully
        console.log('High score saved successfully');

        // Fetch updated leaderboard data
        const leaderboardResponse = await fetch('https://back-end.lukewhite9.repl.co/leaderboard');
        if (leaderboardResponse.ok) {
          const leaderboardData = await leaderboardResponse.json();
          setLeaderboard(leaderboardData);
        } else {
          console.error('Failed to retrieve leaderboard data');
        }
      } else {
        // Failed to save high score
        console.error('Failed to save high score');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://back-end.lukewhite9.repl.co/leaderboard');
        if (response.ok) {
          const leaderboardData = await response.json();
          setLeaderboard(leaderboardData);
        } else {
          console.error('Failed to retrieve leaderboard data');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game Over</ModalHeader>
        <ModalBody>
          <p>Your total score: {totalScore}</p>
          <p>Your total time: {totalTime} seconds</p>
          <Input
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <ul>
            {leaderboard.map((score, index) => (
              <li key={index}>
                {score.name}: {score.score} points, Time: {score.time} seconds
              </li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameOverModal;
