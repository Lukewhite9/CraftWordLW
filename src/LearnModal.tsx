import {
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

const LearnModal: React.FC<LearnModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="gray.100">
        <ModalHeader textAlign="center">
          How To Play{" "}
          {generateText("WORD", "green.500", "bold")} →
          {generateText("PATH", "blue.500", "bold")}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <Text mb={4}>
              Get from{" "}
              {generateText("START", "green.500", "bold")} to{" "}
              {generateText("GOAL", "blue.500", "bold")} in as few words as possible.
            </Text>

            <Text mb="4">
              You can{" "}
              {generateText("add", "green", "bold")},{" "}
              {generateText("remove", "red", "bold")},{" "}
              {generateText("change", "orange.500", "bold")}, or{" "}
              {generateText("swap", "purple", "bold")} one letter at a time to make new words.
            </Text>

            <Text mb="2">Like this:</Text>
            <Text mb="2">
              {generateText("add", "green", "bold")}: <br />
              at → {generateText("r", "green", "bold")}at → rat
              {generateText("s", "green", "bold")} → rat
              {generateText("e", "green", "bold")}s
            </Text>

            <Text mb="2">
              {generateText("change", "orange.500", "bold")}: <br />
              date → {generateText("m", "orange.500", "bold")}ate → ma
              {generateText("l", "orange.500", "bold")}e → {generateText("p", "orange.500", "bold")}ale
            </Text>

            <Text mb="2">
              {generateText("remove", "red", "bold")}: <br />
              like this: sta{generateText("r", "red", "bold")}red → stare{generateText("d", "red", "bold")} → star{generateText("e", "red", "bold")} → sta{generateText("r", "red", "bold")} → tar
            </Text>

            <Text mb="2">
              {generateText("swap", "purple", "bold")}: <br />
              race → {generateText("c", "purple", "bold")}a{generateText("r", "purple", "bold")}e → {generateText("ac", "purple", "bold")}re
              <br />
              each → ach{generateText("e", "purple", "bold")}, reef → {generateText("f", "purple", "bold")}ree
            </Text>

            <br />
            <Text mb="4">
              Try practice mode to learn how to play.
              <br />
              <br />A new, five round game daily!
            </Text>
            <br />
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              OK
            </Button>
          </div>
        </ModalBody>

        <ModalFooter>
          <Box
            position="absolute"
            width="100%"
            bottom="5"
            display="flex"
            justifyContent="center"
          ></Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LearnModal;
