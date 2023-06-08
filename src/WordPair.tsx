import React, { useState, ChangeEvent } from "react";
import { Text, Box, Flex, Input } from "@chakra-ui/react";
import CurrentWord from './CurrentWord';

type WordPairProps = {
  wordPair: string[];
  onSubmitWord: (word: string) => void;
  currentWord: string;
  pastMoves: string[];
};

const WordPair: React.FC<WordPairProps> = ({
  wordPair,
  onSubmitWord,
  currentWord,
  pastMoves,
}) => {
  const [userInput, setUserInput] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmitWord(e.target.value, () => {
        setUserInput("");
      });
    }
  };

  const calculateFontSize = () => {
    const maxFontSize = 18; // Maximum font size
    const minFontSize = 10; // Minimum font size
    const initialFontSize = 14; // Initial font size
    const maxPastWords = 18; // Maximum number of past words before reducing font size

    if (pastMoves.length <= maxPastWords) {
      return initialFontSize;
    } else {
      const fontSizeIncrement = (maxFontSize - minFontSize) / (pastMoves.length - maxPastWords);
      const fontSize = initialFontSize - (fontSizeIncrement * (pastMoves.length - maxPastWords));
      return Math.max(fontSize, minFontSize);
    }
  };

  return (
    <Flex
      direction="row"
      justifyContent="space-between"
      minHeight="calc(100vh - 400px)"
      border="1px solid"
      borderColor="transparent"
      borderRadius="base"
      p="4"
    >
      <Flex direction="column" flex="1 0 33%">
        <Box>
          <Box textAlign="center">
            <Text fontSize="sm" color="green">
              START
            </Text>
            <Text fontWeight="bold" fontSize="xl">
              {wordPair[0]}
            </Text>
          </Box>
          <Box minHeight="375" overflowY="auto">
            <Flex direction="column" alignItems="center">
              {pastMoves.map((word, i) => (
                <Box key={`${word}-${i}`} fontSize={calculateFontSize()}>{word}</Box>
              ))}
            </Flex>
          </Box>
          <Box textAlign="center">
            <Text fontWeight="bold" fontSize="xl">
              {wordPair[1]}
            </Text>
            <Text fontSize="sm" color="blue">
              GOAL
            </Text>
          </Box>
        </Box>
      </Flex>
      <Flex direction="column" flex="2 0 67%">
        <Box flexGrow={1} my="0" textAlign="center">
          <Box minHeight="200px">
            <Text fontSize="sm" textAlign="left" mt="0.5">
              <Text as="span" fontWeight="bold">
                placeholder
              </Text>
              <br />
              plās′hōl″dər
              <br />
              <Text as="span" fontStyle="italic">
                noun
              </Text>
              <br />
              <br />
              1) One who holds an office or place, especially as a deputy, proxy,
              or appointed government official.
              <br />
              <br />
              2) In a mathematical or logical expression, a symbol that may be
              replaced by the name of any element of a set.
            </Text>
          </Box>
          <Box my="4">
            
          </Box>
        </Box>
        <Box textAlign="center">
          <CurrentWord currentWord={currentWord} />
          <Input
              placeholder="New Word"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              sx={{
                "&::placeholder": {
                  textAlign: "center",
                },
              }}
            />
        </Box>
      </Flex>
    </Flex>
  );
};

export default WordPair;
