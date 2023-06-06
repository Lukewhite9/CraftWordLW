import './App.css'
import { useState } from "react";
import {
  ChakraProvider,
  Heading,
  Box,
  Flex,
  Text,
  Button
} from '@chakra-ui/react';
import GameWrapper from './GameWrapper';
import LearnModal from './LearnModal';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false); 
  const [wordList, setWordList] = useState<string[]>([]);

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

  async function handleStartClick(practiceMode: boolean = false) { // Modified line
    setIsPlaying(true);
    setIsPracticeMode(practiceMode); // Add this line
    const filePath = '../ospd.txt';
    readFileToArray(filePath)
      .then(wordList => {
        setWordList(wordList);
      });
  }

  console.log("App render")

  return (
    <ChakraProvider>
      <Box h="100%" w="100%">
        <Flex
          direction="column"
          justify="center"
          align="center"
          textAlign="center"
        >
          <Heading my="4">Wordpath 🤓</Heading>
          <Text fontSize="lg">
            Get from
            {" "}
            <Text as="span" color="red">START</Text>
            {" "}
            to
            {" "}
            <Text as="span" color="green">GOAL</Text>
            {" "}
            in as few words as possible.
            First time?
            {" "}
            <LearnModal text="Read the rules" />
            .
          </Text>
        </Flex>
        <Flex my={4} direction="column" alignItems="center">
          {isPlaying && wordList.length > 0 ? (
            <GameWrapper wordList={wordList} isPracticeMode={isPracticeMode} /> // Modified line
          ) : (
            <>
              <Button
                colorScheme="green"
                onClick={() => handleStartClick(false)} // Modified line
              >
                Start Game
              </Button>
              <Button
                colorScheme="blue" // Or any other color scheme you prefer
                onClick={() => handleStartClick(true)} // Add this line
                mt={4} // Add some margin to separate the buttons
              >
                Start Practice Mode
              </Button>
            </>
          )}
        </Flex>
      </Box>
    </ChakraProvider >
  )
}
