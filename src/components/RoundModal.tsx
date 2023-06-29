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

type RoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  onContinue: () => void;
  time: number;
};

const RoundModal: React.FC<RoundModalProps> = ({
  isOpen,
  onClose,
  score,
  onContinue,
  time,
}) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time % 60);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Round Over</ModalHeader>
        <ModalBody>
          <p>Your score for this round: {score}</p>
          <p>Time taken: {minutes} minutes {seconds} seconds</p>
        </ModalBody>
        <ModalFooter>
          <Button
  onClick={() => {
    onContinue();
    onClose();
  }}
>
  Continue
</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoundModal;
