import { useState, useEffect } from 'react';
import {
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
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

import Game from '../../components/Game';
import LearnModal from '../../components/LearnModal';
import { datesAreOnSameDay } from '../../utils/utils';
import AboutModal from '../../components/AboutModal';
import GameMenu from '../../components/GameMenu';
import LeaderboardModal from '../../components/LeaderboardModal';
import GameCountdown from '../../components/GameCountdown';
import GameIntro from '../../components/GameIntro';

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
    const filePath = '../dictionary/ospd.txt';
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
                <Text color="green.500">CRAFT</Text>
                <Text>→</Text>
                <Text color="blue.500">WORD</Text>
              </Flex>
            </Heading>
            <GameMenu
              onAboutModalOpen={onAboutModalOpen}
              onLeaderboardOpen={onLeaderboardModalOpen}
            />
          </HStack>
          <Divider mt={4} borderColor="gray.250" />
          {!isPlaying && (
            <GameIntro onLearnModalOpen={onLearnModalOpen} />
          )}
        </Flex>
        <Flex my={4} mx={4} direction="column" alignItems="center">
          {alreadyPlayed ? (
            <Flex align="center" justify="center" direction="column">
              <Text textAlign="center">
                Looks like you already played today's round. Check back tomorrow!
              </Text>
              <GameCountdown />
            </Flex>
          ) : (
            <>
              {isPlaying && wordList.length > 0 ? (
                <Game
                  wordList={wordList}
                  gameLength={isPracticeMode ? null : 5}
                />
              ) : (
                <>
                  <Button
                    colorScheme="blackAlpha"
                    onClick={() => handleStartClick(false)}
                    w="300px"
                    mt="8"
                    boxShadow="md"
                  >
                    Start Game
                  </Button>
                  <Button
                    colorScheme="gray"
                    mt="4"
                    w="300px"
                    boxShadow="md"
                    onClick={() => handleStartClick(true)}
                  >
                    Practice
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
  );
}
