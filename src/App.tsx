import { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

import GameWrapper from './GameWrapper';
import LearnModal from './LearnModal';
import { datesAreOnSameDay } from './utils';
import AboutModal from './AboutModal';
import GameMenu from './GameMenu';
import LeaderboardModal from './LeaderboardModal';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [wordList, setWordList] = useState<string[]>([]);
  const {
    isOpen: isLearnModalOpen,
    onOpen: onLearnModalOpen,
    onClose: onLearnModalClose,
  } = useDisclosure();

  const {
    isOpen: isAboutModalOpen,
    onOpen: onAboutModalOpen,
    onClose: onAboutModalClose,
  } = useDisclosure();

  const {
    isOpen: isLeaderboardModalOpen,
    onOpen: onLeaderboardModalOpen,
    onClose: onLeaderboardModalClose,
  } = useDisclosure();

  function readFileToArray(filePath: string) {
    return fetch(filePath)
      .then((response) => response.text())
      .then((data) => data.split('\n').map((line) => line.replace('\r', '')))
      .catch((error) => {
        console.log('Error:', error);
        return [];
      });
  }

  async function handleStartClick(practiceMode: boolean = false) {
    setIsPlaying(true);
    setIsPracticeMode(practiceMode);
    const filePath = '../ospd.txt';
    readFileToArray(filePath).then((wordList) => {
      setWordList(wordList);
    });
  }

  useEffect(() => {
    const localValue = localStorage.getItem('lastPlayed');
    const lastPlayedUnixTimestamp = localValue ? JSON.parse(localValue) : 0;
    const lastPlayedDate = new Date(lastPlayedUnixTimestamp * 1000);
    if (datesAreOnSameDay(lastPlayedDate, new Date())) {
      setAlreadyPlayed(true);
    }
  }, [setAlreadyPlayed]);

  return (
    <ChakraProvider>
      <Container maxW="460px" centerContent>
        <Box
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          mt="2"
          p={4}
          minHeight="450px"
          boxShadow="md"
        >
          <Flex
            direction="column"
            justify="center"
            align="center"
            textAlign="center"
          >
            <HStack w="388px" justify="space-between">
              <IconButton
                aria-label="Learn how to play"
                icon={<QuestionOutlineIcon />}
                variant="outline"
                boxShadow="sm"
                onClick={onLearnModalOpen}
              />
              <Heading mt="4" mb="4">
                <Flex alignItems="center">
                  <Text color="green.500">WORD</Text>
                  <Text>→</Text>
                  <Text color="blue.500">PATH</Text>
                </Flex>
              </Heading>
              <GameMenu
                onAboutModalOpen={onAboutModalOpen}
                onLeaderboardOpen={onLeaderboardModalOpen}
              />
            </HStack>
            <Divider mt={4} borderColor="gray.250" />
            {!isPlaying && (
              <Text fontSize="lg" mt="8">
                Get from{' '}
                <Text as="span" color="green.500" fontWeight="semibold">
                  START
                </Text>{' '}
                to{' '}
                <Text as="span" color="blue.500" fontWeight="semibold">
                  GOAL
                </Text>{' '}
                in as few words as possible.
                <p>
                  First time?{' '}
                  <Link onClick={onLearnModalOpen}>Read the rules</Link>.
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
                      w="300px"
                      mt="14"
                      boxShadow="md"
                    >
                      Start Game
                    </Button>
                    <Button
                      colorScheme="gray"
                      mt="4"
                      w="300px"
                      onClick={() => handleStartClick(true)}
                      boxShadow="md"
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
        <LeaderboardModal
          isOpen={isLeaderboardModalOpen}
          onClose={onLeaderboardModalClose}
        />
      </Container>
    </ChakraProvider>
  );
}
