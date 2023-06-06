import React, {useEffect} from 'react';
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
  roundScore: number;
  handleRoundOver: (roundScore: number) => void;
};

const RoundModal: React.FC<RoundModalProps> = ({
  isOpen,
  onClose,
  roundScore,
}) => {
  const handleClose = () => {
    onClose();
  };
  
useEffect(() => {
  console.log("Round score: ", roundScore);
}, [roundScore]);
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Round Over</ModalHeader>
        <ModalBody>
          Your score for this round: {roundScore}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleClose}>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoundModal;
