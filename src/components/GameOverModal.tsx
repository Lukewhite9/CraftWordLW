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
import { saveHighScore, retrieveHighScore } from './api';

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
    console.log("submit with data: ", playerName.trim(), totalScore, totalTime);
    // TODO: Hook up leaderboard
    // try {
    //   await saveHighScore(playerName.trim(), totalScore, totalTime);
    //   await fetchLeaderboard();
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const fetchLeaderboard = async () => {
    // TODO: Hook up leaderboard
    // try {
    //   const leaderboardData = await retrieveHighScore();
    //   setLeaderboard(leaderboardData);
    // } catch (error) {
    //   console.error(error);
    // }
    return [{
      name: "ACP",
      score: 12,
      time: 103
    }]
  };

  useEffect(() => {
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
