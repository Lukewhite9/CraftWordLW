import React from 'react';
import {
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Button,
  ModalFooter,
  Text,
  Box
} from "@chakra-ui/react";

type LearnModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartPracticeMode: () => void; // Add the prop for starting practice mode
};

const generateText = (
  text: string,
  color: string,
  fontWeight: string
): JSX.Element => (
  <Text as="span" color={color} fontWeight={fontWeight}>
    {text}
  </Text>
);

const LearnModal: React.FC<LearnModalProps> = ({ isOpen, onClose, onStartPracticeMode }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="gray.100">
        <ModalHeader textAlign="center">
          How To Play{" "}
          {generateText("CRAFT", "green.500", "bold")} →
          {generateText("WORD", "blue.500", "bold")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            Get from{' '}
            {generateText('START', 'green.500', 'bold')} to{' '}
            {generateText('GOAL', 'blue.500', 'bold')} in as few words as possible.
          </Text>

          <Text mb="4">
            To make new words you can{' '}
            {generateText('add', 'green', 'bold')},{' '}
            {generateText('remove', 'red', 'bold')},{' '} or{' '}
            {generateText('change', 'orange.500', 'bold')} one letter at a time, or {' '}
            {generateText('swap', 'purple', 'bold')} all the letters any way you want.
          </Text>

          <Text mb="2">Like this:</Text>
          <Text mb="2">
            {generateText('add', 'green', 'bold')}: <br />
            at → {generateText('r', 'green', 'bold')}at → rat
            {generateText('s', 'green', 'bold')} → rat
            {generateText('e', 'green', 'bold')}s
          </Text>

          <Text mb="2">
            {generateText('change', 'orange.500', 'bold')}: <br />
            date → {generateText('l', 'orange.500', 'bold')}ate → la
            {generateText('k', 'orange.500', 'bold')}e → l{generateText('i', 'orange.500', 'bold')}ke
          </Text>

          <Text mb="2">
            {generateText('remove', 'red', 'bold')}: <br />
            sta{generateText('r', 'red', 'bold')}red → stare{generateText('d', 'red', 'bold')} → star{generateText('e', 'red', 'bold')} → sta{generateText('r', 'red', 'bold')} → tar
          </Text>

          <Text mb="2">
             {generateText('swap', 'purple', 'bold')}: <br />
            stale → s{generateText('l', 'purple', 'bold')}a{generateText('t', 'purple', 'bold')}e → s{generateText('t', 'purple', 'bold')}{generateText('e', 'purple', 'bold')}{generateText('a', 'purple', 'bold')}{generateText('l', 'purple', 'bold')} → {generateText('least', 'purple', 'bold')}
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LearnModal;
