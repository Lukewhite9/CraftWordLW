import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box
} from '@chakra-ui/react';

export default function AboutModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">About This Game</ModalHeader>
        <ModalCloseButton />
<ModalBody>
  <Text mb={4}>Wordpath is a game about transforming words. Each new word is a step on a path to the goal word. The shorter the path, the better your score. The best path might have words you don't use every day, but only real words in English are allowed. </Text>
  <Text mb={5}>I thought of Wordpath while watching my four year old son learn to spell. I learned to code the game by asking ChatGPT how to make it, and then I finished it with a human friend. </Text>
  <Text mb={4}>Thanks for playing!</Text>
  <Text mb={7}>-Lukematik</Text>
  <Box display="flex" justifyContent="flex-end">
    <Button variant="outline" onClick={onClose}>
      Close
    </Button>
  </Box>
</ModalBody>
<ModalFooter justifyContent="center">
  <Text color="gray.500" fontSize="smaller">©2023 Lukematik and ACPrice</Text>
</ModalFooter>

      </ModalContent>
    </Modal>
  );
}
