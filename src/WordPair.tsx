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

  return (
    <Flex
      direction="row" // Updated direction to row
      alignItems="flex-start"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="base"
      p="4"
    >
      <Flex direction="column" flex="1" pr="4">
        <Box>
          <Text fontSize="medium" color="green">
            START
          </Text>
          <Text fontWeight="bold" fontSize="xl">
            {wordPair[0]}
          </Text>
        </Box>
        <Flex direction="column" mt="4" align="flex-start">
          {pastMoves.length === 0 && (
            <Text fontSize="l" color="gray">
            </Text>
          )}
          <Flex direction="column">
            {!!pastMoves &&
              pastMoves.length > 0 &&
              pastMoves.map((word, i) => (
                <Box key={`${word}-${i}`}>{word}</Box>
              ))}
          </Flex>
        </Flex>
        <Box mt="auto">
          <Text fontWeight="bold" fontSize="xl">
            {wordPair[1]}
          </Text>
          <Text fontSize="medium" color="blue">
            GOAL
          </Text>
        </Box>
      </Flex>
      <Flex direction="column" flex="1"> 
        <Box my="4" textAlign="center">
          <Text fontSize="xl" color="gray">
            CURRENT
          </Text>
          <CurrentWord currentWord={currentWord} />
        </Box>
        <Box my="4">
          <Input
            placeholder="Enter New Word Here"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default WordPair;
