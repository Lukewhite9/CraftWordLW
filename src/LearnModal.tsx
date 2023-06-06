import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  Button,
  Link,
  ModalFooter,
  Text,
  Box
} from "@chakra-ui/react";

type LearnModalProps = {
  text: string;
  practiceMode?: boolean;
  togglePracticeMode?: () => void;
};

const LearnModal: React.FC<LearnModalProps> = ({ text, practiceMode, togglePracticeMode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Link fontWeight="medium" href="#" onClick={onOpen}>
        {text}
      </Link>
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How To Play Wordpath</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="4">
              The object of the game is to make a path from the START word to the GOAL word by transforming words into others.
              The shorter your path, the better your score!
            </Text>

            <Text mb="4">
              You make new words by changing your current word. You can swap, add, change, or remove one letter at a time.
              Each new word you make must be a valid English word.
            </Text>

            <Text fontWeight="bold" mb="2">
              Here are some ways you can make words:
            </Text>
            <Text mb="2">
              Add: Add one letter to your word.
              <br />
          like this: at -> rat -> rats -> rates
            </Text>

            <Text mb="2">
              Change: Change one letter in your word.
              <br />
          like this: date -> mate -> male -> pale
            </Text>

            <Text mb="2">
              Remove: Remove one letter from your word.
              <br />
          like this: starred -> stared -> stare -> star -> tar
            </Text>

            <Text mb="2">
              Swap: Swap two letters in your word.
              <br />
          like this: rat -> art, or cats -> cast, or care -> acre
            </Text>

            <Text mb="4">
              Got it? So, putting it all together, you can make a path from 'two' to 'sop' like this:
            </Text>

            <Text fontWeight="bold" mb="2">
              START WORD: two
            </Text>
            <Text fontWeight="bold" mb="2">
              GOAL WORD: sop
            </Text>

            <Text mb="2">
              two   ::  two —&gt; tow (swap)
            </Text>
            <Text mb="2">
              tow   ::  tow —&gt; stow (add)
            </Text>
            <Text mb="2">
              stow  ::  stow —&gt; stop (change)
            </Text>
            <Text mb="2">
              stop  ::  stop —&gt; sop (remove)
            </Text>
            <Text mb="2">
              sop   ::  and you did it!
            </Text>

            <Text mb="4">
              Your path took 4 steps, so your score for this round is 4.
            </Text>

            <Text mb="4">
              Can you make it through 5 rounds?
              Remember, lower scores are better!
            </Text>
          </ModalBody>

          <ModalFooter>
            <Box
              position="absolute"
              width="100%"
              bottom="5"
              display="flex"
              justifyContent="center"
            >
              <Button colorScheme='blue' mr={3}
                onClick={togglePracticeMode, onClose}
              >
                {practiceMode ? 'Exit Practice Mode' : 'Enter Practice Mode'}
              </Button>
            </Box>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              I Think I Got It, Let's Play
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LearnModal;
