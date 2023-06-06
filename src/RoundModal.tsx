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

type RoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const RoundModal: React.FC<RoundModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Congratulations!</ModalHeader>
        <ModalBody>
          Round Over; There's More!
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RoundModal;
