import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import GameCountdown from './GameCountdown'; 

type GameOverModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalScore: number;
  totalTime: number;
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  totalScore,
  totalTime,
}) => {
  const minutes = Math.floor(totalTime / 60);
  const seconds = Math.round(totalTime % 60);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Game Over</ModalHeader>
        <ModalBody>
          <p>Your total score: {totalScore}</p>
          <p>Total time taken: {minutes} minutes {seconds} seconds</p>
          <GameCountdown /> {/* add Countdown component here */}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameOverModal;
