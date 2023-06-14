import { useState, useEffect } from "react";
import {
  ChakraProvider,
  Heading,
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  HStack,
  Container,
  Divider,
  useDisclosure,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react';
import { ChevronDownIcon, QuestionOutlineIcon, HamburgerIcon } from '@chakra-ui/icons';

import GameWrapper from './GameWrapper';
import LearnModal from './LearnModal';
import { datesAreOnSameDay } from "./utils";
import AboutModal from './AboutModal';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [wordList, setWordList] = useState<string[]>([]);
  const {
    isOpen: isLearnModalOpen,
    onOpen: onLearnModalOpen,
    onClose: onLearnModalClose
  } = useDisclosure();
  
  const {
    isOpen: isAboutModalOpen,
    onOpen: onAboutModalOpen,
    onClose: onAboutModalClose
  } = useDisclosure();
  
  const paypalDonateLink = 'https://www.paypal.com/donate/?hosted_button_id=Y3FU5EF7L86T6'; 

  function readFileToArray(filePath: string) {
    return fetch(filePath)
      .then(response => response.text())
      .then(data => data
        .split('\n')
        .map(line => line.replace("\r", "")))
      .catch(error => {
        console.log('Error:', error);
        return [];
      });
  }

  async function handleStartClick(practiceMode: boolean = false) {
    setIsPlaying(true);
    setIsPracticeMode(practiceMode);
    const filePath = '../ospd.txt';
    readFileToArray(filePath)
      .then(wordList => {
        setWordList(wordList);
      });
  }

  useEffect(() => {
    const localValue = localStorage.getItem("lastPlayed");
    const lastPlayedUnixTimestamp = JSON.parse(localValue);
    const lastPlayedDate = new Date(lastPlayedUnixTimestamp * 1000);
    if (datesAreOnSameDay(lastPlayedDate, new Date())) {
      setAlreadyPlayed(true);
    }
  }, [setAlreadyPlayed])

return (
    <ChakraProvider>
      <Container maxW="460px" centerContent>
        <Box
          borderWidth="3px"
          borderColor="gray.200"
          borderRadius="md"
          p={4}
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            textAlign="center"
          >
            <HStack w="390px" justify="space-between">
              <IconButton
                aria-label="Learn how to play"
                icon={<QuestionOutlineIcon />}
                variant="outline"
                onClick={onLearnModalOpen}
              />
              <Heading mt="4" mb="4">
                <Flex alignItems="center">
                  <Text color="green.500">WORD</Text>
                  <Text>→</Text>
                  <Text color="blue.500">PATH</Text>
                </Flex>
              </Heading>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                />
                <MenuList>
                  <MenuItem onClick={onAboutModalOpen}>About This Game</MenuItem>
                  <MenuItem as="a" href="mailto:wordpathgame@gmail.com">Feedback</MenuItem>
                  <MenuItem 
                    as="a" 
                    href={paypalDonateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Tip Jar
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
            <Divider mt={4} borderColor="gray.200" />
            {!isPlaying && (
              <Text fontSize="lg">
                Get from{" "}
                <Text as="span" color="green.500">
                  START
                </Text>{" "}
                to{" "}
                <Text as="span" color="blue.500">
                  GOAL
                </Text>{" "}
                in as few words as possible.
                <p>
                  First time?{" "}
                  <Link onClick={onLearnModalOpen}>Read the rules</Link>
                  .
                </p>
              </Text>
            )}
          </Flex>
          <Flex my={4} mx={4} direction="column" alignItems="center">
            {alreadyPlayed ? (
              <Flex align="center" justify="center">
                <Text textAlign="center">
                  Looks like you already played today's round. Check back tomorrow!
                </Text>
              </Flex>
            ) : (
              <>
                {isPlaying && wordList.length > 0 ? (
                  <GameWrapper
                    wordList={wordList}
                    gameLength={isPracticeMode ? null : 5}
                  />
                ) : (
                  <>
                    <Button
                      colorScheme="blackAlpha"
                      onClick={() => handleStartClick(false)}
                      w="80%"
                    >
                      Start Game
                    </Button>
                    <Button
                      colorScheme="gray"
                      onClick={() => handleStartClick(true)}
                      mt={4}
                      w="80%"
                    >
                      Start Practice Mode
                    </Button>
                  </>
                )}
              </>
            )}
          </Flex>
        </Box>
        <LearnModal isOpen={isLearnModalOpen} onClose={onLearnModalClose} />
        <AboutModal isOpen={isAboutModalOpen} onClose={onAboutModalClose} />

      </Container>
    </ChakraProvider>
  );
}
