import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from '@chakra-ui/react';

type GameOverModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(false) }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalBody>
          Game Over :|
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => { onClose(false) }}>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GameOverModal;
