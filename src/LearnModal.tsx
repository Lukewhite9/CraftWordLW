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

const LearnModal: React.FC<LearnModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}  size="md">
      <ModalOverlay />
      <ModalContent bg="gray.100">
        <ModalHeader textAlign="center">How To Play <Text as="span" color="green.500" fontWeight="bold">WORD</Text>→<Text as="span" color="blue.500" fontWeight="bold">PATH</Text>  </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Text mb={4}>
    Get from <Text as="span" color="green.500" fontWeight="bold">START</Text> to <Text as="span" color="blue.500" fontWeight="bold">GOAL</Text> in as few words as possible.
  </Text>

          <Text mb="4">
            You  can <Text as="span" color="green" fontWeight="bold">add</Text>, <Text as="span" color="red" fontWeight="bold">remove</Text>, <Text as="span" color="orange.500" fontWeight="bold">change</Text>, or <Text as="span" color="purple" fontWeight="bold">swap</Text> one letter at a time to make new words.
          </Text>

          <Text mb="2">
            Like this:
          </Text>
          <Text mb="2">
            <Text as="span" color="green"fontWeight="bold">add</Text>: 
            <br />
           at → <Text as="span" color="green"fontWeight="bold">r</Text>at → rat<Text as="span" color="green"fontWeight="bold">s</Text> → rat<Text as="span" color="green"fontWeight="bold">e</Text>s
          </Text>

          <Text mb="2">
            <Text as="span" color="orange.500"fontWeight="bold">change</Text>: 
            <br />
            date → <Text as="span" color="orange.500"fontWeight="bold">m</Text>ate → ma<Text as="span" color="orange.500"fontWeight="bold">l</Text>e → <Text as="span" color="orange.500"fontWeight="bold">p</Text>ale
          </Text>

          <Text mb="2">
            <Text as="span" color="red"fontWeight="bold">remove</Text>: 
            <br />
          like this: sta<Text as="span" color="red"fontWeight="bold">r</Text>red → stare<Text as="span" color="red"fontWeight="bold">d</Text> → star<Text as="span" color="red"fontWeight="bold">e</Text> → sta<Text as="span" color="red"fontWeight="bold">r</Text> → tar
          </Text>

          <Text mb="2">
            <Text as="span" color="purple"fontWeight="bold">swap</Text>: 
            <br />
              <Text as="span" color="purple"fontWeight="bold">r</Text>a<Text as="span" color="purple"fontWeight="bold">c</Text>e → <Text as="span" color="purple"fontWeight="bold">ca</Text>re → acre
          </Text>

          <br />
          <Text mb="4">
            Try practice mode to learn how to play.
            <br />
            <br />A new, five round game daily!
          </Text>
          <br />
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            OK
          </Button>
        </ModalBody>

        <ModalFooter>
          <Box
            position="absolute"
            width="100%"
            bottom="5"
            display="flex"
            justifyContent="center"
          >
          </Box>

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default LearnModal;
