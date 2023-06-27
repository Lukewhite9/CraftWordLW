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
            You can{' '}
            {generateText('add', 'green', 'bold')},{' '}
            {generateText('remove', 'red', 'bold')},{' '}
            {generateText('change', 'orange.500', 'bold')}, or{' '}
            {generateText('swap', 'purple', 'bold')} one letter at a time to make new words.
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
            Any two letters: race → {generateText('c', 'purple', 'bold')}a{generateText('r', 'purple', 'bold')}e → {generateText('ac', 'purple', 'bold')}re
            <br />
            First letter to last: each → ach{generateText('e', 'purple', 'bold')}
            <br />
            Or last letter to first: reef → {generateText('f', 'purple', 'bold')}ree
          </Text>

          <Text my="4">
            Try practice mode to learn how to play!
          </Text>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <Box >
            <Button
              colorScheme="blue"
              boxShadow="md"
              mt="-3"
              mb="2"
              onClick={() => {
                onStartPracticeMode();
                onClose();
              }}
            >
              Try Practice Mode
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LearnModal;