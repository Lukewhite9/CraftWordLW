import React, { useState } from "react";
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
  Divider
} from '@chakra-ui/react';
import { QuestionOutlineIcon, HamburgerIcon } from '@chakra-ui/icons';
import GameWrapper from './GameWrapper';
import LearnModal from './LearnModal';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [wordList, setWordList] = useState<string[]>([]);
  const [introText, setIntroText] = useState(true); // Updated state variable

  function readFileToArray(filePath: string) {
    return fetch(filePath)
      .then(response => response.text())
      .then(data => data
        .split('\n')
        .map(line => line.replace("\r", "")))
      .catch(error => {
        console.log('Error:', error);
        return []; // Return an empty array in case of an error
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

  function handleIntroTextDismiss() {
    setIntroText(false);
  }

  return (
    <ChakraProvider>
  <Container maxW="460px" centerContent>
    <Box
      borderWidth="3px" // set the border width
      borderColor="gray.200" // set the border color
      borderRadius="md" // set the border radius (optional)
      p={4} // add some padding (optional)
    >
      <Flex
        direction="column"
        justify="center"
        align="center"
        textAlign="center"
      >
        <HStack HStack w="390px" justify="space-between">
          <IconButton
            aria-label="Learn how to play"
            icon={<QuestionOutlineIcon />}
            
          />
          <Heading mt="4" mb="4">
  <Flex alignItems="center">
    <Text color="green.500">WORD</Text>
    <Text>→</Text>
    <Text color="blue.500">PATH</Text>
  </Flex>
</Heading>

          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
          />
        </HStack>
        <Divider mt={4} borderColor="gray.200" />
        {!isPlaying && introText && (
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
              <LearnModal text="Read the rules" onClick={handleIntroTextDismiss} />
              .
            </p>
          </Text>
        )}
      </Flex>
      <Flex my={4} mx={4} direction="column" alignItems="center">
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
      </Flex>
    </Box>
  </Container>
</ChakraProvider>

  );
}
