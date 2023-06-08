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
      <Container maxW="500px" centerContent>
        <Flex
          direction="column"
          justify="center"
          align="center"
          textAlign="center"
        >
          <HStack spacing={4}>
            <IconButton
              aria-label="Learn how to play"
              icon={<QuestionOutlineIcon />}
              size="sm"
            />
            <Heading my="8" mt="4">   WORD→PATH   </Heading>
            <IconButton
              aria-label="Menu"
              icon={<HamburgerIcon />}
              size="sm"
            />
          </HStack>
          <Divider my={-1} />
          {!isPlaying && introText && (
  <Text fontSize="lg">
    Get from
    {" "}
    <Text as="span" color="green">START</Text>
    {" "}
    to
    {" "}
    <Text as="span" color="blue">GOAL</Text>
    {" "}
    in as few words as possible.
    <p>  First time?
    {" "}
      <LearnModal text="Read the rules" onClick={handleIntroTextDismiss} />
      .</p>
  </Text>
          )}
        </Flex>
        <Flex my={4} direction="column" alignItems="center">
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
              >
                Start Game
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleStartClick(true)}
                mt={4}
              >
                Start Practice Mode
              </Button>
            </>
          )}
        </Flex>
      </Container>
    </ChakraProvider>
  )
}
