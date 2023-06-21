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
import LeaderboardModal from './LeaderboardModal'; // Import the LeaderboardModal component

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
    isOpen: isLeaderboardModalOpen, // Add new state for the leaderboard modal
    onOpen: onLeaderboardModalOpen, // Add new disclosure for the leaderboard modal
    onClose: onLeaderboardModalClose, // Add new disclosure for the leaderboard modal
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
        {/* Rest of your JSX code */}
        {/* ... */}
        {/* Add a button to open the leaderboard modal */}
        <Button colorScheme="blue" mt={4} onClick={onLeaderboardModalOpen}>
          Open Leaderboard
        </Button>
        {/* Render the leaderboard modal */}
        <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={onLeaderboardModalClose} />
      </Container>
    </ChakraProvider>
  );
}
