import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';

type Score = {
  name: string;
  score: number;
};

type LeaderboardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Leaderboard</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {scores.map((score, index) => (
            <div key={index}>
              <h2>{score.name}: {score.score} points</h2>
            </div>
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeaderboardModal;
