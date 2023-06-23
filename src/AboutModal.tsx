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
        <ModalHeader mb={-3} textAlign="center">
          ABOUT{" "}
          {generateText("LOGO", "green.500", "bold")}→
          {generateText("LINK", "blue.500", "bold")}
        </ModalHeader>
        <ModalCloseButton />
<ModalBody>
  <Text mb={1.5}>→ Solve daily word puzzles with the foresight of a chess master.</Text>
  <Text mb={1.5}>→ Use rare words to find shortcuts and improve your score.</Text> 
  <Text mb={4}>→ Race against the clock to climb the leaderboard with new challenges every day!</Text>
  <Text mb={4}>{generateText("LOGO", "green.500", "bold")}{generateText("LINK", "blue.500", "bold")} is a game of transforming one word into another to solve puzzles. {generateText("Add", "green", "bold")}, {generateText("remove", "red", "bold")}, {generateText("change", "orange.500", "bold")}, or {generateText("swap", "purple", "bold")} one letter at a time to find your path to the goal word before your moves run out. The shorter your path, the better your score!</Text>
  <Text mb={4}>Some words are a short path away in the game of {generateText("LOGO", "green.500", "bold")}{generateText("LINK", "blue.500", "bold")}, like “walk” and “{generateText("t", "orange.500", "bold")}alk.” Some are just a bit further, like “item” and “team” (item→{generateText("s", "orange.500", "bold")}tem→{generateText("s", "red", "bold")}te{generateText("a", "green", "bold")}m→team). Others con only be joined by a very long path, like “ending” and “waves” (ending→{generateText("s", "green", "bold")}ending→se{generateText("e", "orange.500", "bold")}{generateText("d", "red", "bold")}ing→seeing→s{generateText("e", "red", "bold")}{generateText("w", "orange.500", "bold")}ing→swing→swin{generateText("e", "orange.500", "bold")}→wine{generateText("s", "purple", "bold")}→w{generateText("a", "orange.500", "bold")}nes→wa{generateText("v", "orange.500", "bold")}es).</Text>
  <Text mb={4}>{generateText("LOGO", "green.500", "bold")}{generateText("LINK", "blue.500", "bold")} is an independent game made by a first time coder, lifetime gamer. Thanks for playing! </Text>
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
