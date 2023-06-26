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
const generateText = (
  text: string,
  color: string,
  fontWeight: string
): JSX.Element => (
  <Text as="span" color={color} fontWeight={fontWeight}>
    {text}
  </Text>
);
export default function AboutModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          About{" "}
          {generateText("CRAFT", "green.500", "bold")} →
          {generateText("WORD", "blue.500", "bold")}
        </ModalHeader>
        <ModalCloseButton />
<ModalBody>
  <Text mb={4}>CRAFTWORD is a game where you transform words. Each new word is a step on your path to the goal word. The shorter your path, the better your score. The best path might use words you don't hear every day, but only real words in English are allowed. </Text>
  <Text mb={5}>I thought of CRAFTWORD while watching my four year old son learn to spell. I learned to code the game by asking ChatGPT how to make it, and then I finished it with a human friend. Thanks for playing!</Text>
  <Text mb={6}></Text>
  <Text ml={8} mb={2}>-Lukematik</Text>
</ModalBody>
<ModalFooter justifyContent="right">
  <Text color="gray.500" fontSize="xs">©2023 Lukematik and ACPrice</Text>
</ModalFooter>

      </ModalContent>
    </Modal>
  );
}
