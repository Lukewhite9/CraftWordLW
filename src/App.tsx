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
  <Container maxW="100%" centerContent>
    <Box
      borderWidth="1px" // set the border width
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
        <HStack spacing={20}>
          <IconButton
            aria-label="Learn how to play"
            icon={<QuestionOutlineIcon />}
            size="sm"
          />
          <Heading mt="4" mb="4">   WORD→PATH   </Heading>
          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
            size="sm"
          />
        </HStack>
        <Divider mt={4} borderColor="gray.200" />
        {!isPlaying && introText && (
          <Text fontSize="lg">
            Get from{" "}
            <Text as="span" color="green">
              START
            </Text>{" "}
            to{" "}
            <Text as="span" color="blue">
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
              colorScheme="green"
              onClick={() => handleStartClick(false)}
              w="100%"
            >
              Start Game
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => handleStartClick(true)}
              mt={4}
              w="100%"
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
