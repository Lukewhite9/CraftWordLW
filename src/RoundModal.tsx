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

import { Round } from "./GameWrapper";

type RoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  onContinue: () => void;
};

const RoundModal: React.FC<RoundModalProps> = ({
  isOpen,
  onClose,
  score,
  onContinue,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Round Over</ModalHeader>
        <ModalBody>
          Your score for this round: {score}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onContinue}>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoundModal;
