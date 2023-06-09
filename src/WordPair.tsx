import React, { useState, ChangeEvent } from "react";
import { Text, Box, Flex, Input } from "@chakra-ui/react";
import CurrentWord from './CurrentWord';
import game from './game';

type WordPairProps = {
  wordPair: string[];
  onSubmitWord: (word: string) => void;
  currentWord: string;
  pastMoves: string[];
  errorMessage: string | null;
};

const WordPair: React.FC<WordPairProps> = ({
  wordPair,
  onSubmitWord,
  currentWord,
  pastMoves,
  errorMessage,
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
      direction="row"
      justifyContent="space-between"
      minHeight="900px"
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
            <Text fontSize="xl">
              {wordPair[0]}
            </Text>
          </Box>
          <Box minHeight="27">
            <Flex Flex direction="column" textAlign="center">
              {pastMoves.map((word, i) => (
                <Box key={`${word}-${i}`} fontSize="19px">{word}</Box>
              ))}
            </Flex>
          </Box>
          <Box textAlign="center">
            <Text fontSize="xl">
              {wordPair[1]}
            </Text>
            <Text fontSize="sm" color="blue">
              GOAL
            </Text>
          </Box>
        </Box>
      </Flex>
      <Flex direction="column" flex="2 0 67%">
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
        <Flex direction="column" alignItems="center" my="4">
        {errorMessage && <div>{errorMessage}</div>}
      </Flex>
        <Box flexGrow={1} my="0" textAlign="center">
          <Box minHeight="100px">
            <Text fontSize="sm" textAlign="left" mt="0.5">
              <Text as="span" fontWeight="bold">
                <br />placeholder
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
        
      </Flex>
    </Flex>
  );
};

export default WordPair;
