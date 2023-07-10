import React, { useState, ChangeEvent } from "react";
import { Text, Box, Flex, Input, Wrap, Button } from "@chakra-ui/react";
import GetDefinition from './GetDefinition';
import PastMovesList from './PastMovesList';

type WordPairProps = {
  wordPair: string[];
  onSubmitWord: (userInput: string, clearInput: () => void) => void;
  currentWord: string;
  pastMoves: string[];
  maxMoves: number;
  errorMessage: string | null;
};

const WordPair: React.FC<WordPairProps> = ({
  wordPair,
  onSubmitWord,
  currentWord,
  pastMoves,
  maxMoves,
  errorMessage,
}) => {
  const [userInput, setUserInput] = useState<string>("");

  const handleInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const lowercaseInput = e.target.value.toLowerCase();
    if (lowercaseInput.indexOf(" ") === -1) {
      setUserInput(lowercaseInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmitWord(userInput, () => {
        setUserInput("");
      });
    }
  };

  const handleButtonClick = () => {
    onSubmitWord(userInput, () => {
      setUserInput("");
    });
  };

  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      border="1px solid"
      borderColor="transparent"
      borderRadius="base"
      width='100%'
    >
      <Flex direction="row" alignItems="baseline">
        <Box textAlign="left">
          <Text fontWeight="bold" fontSize="xl">{wordPair[0]}</Text>
        </Box>
        <Box marginLeft="auto" textAlign="right">
          <Text fontWeight="bold" fontSize="xl">{wordPair[1]}</Text>
        </Box>
      </Flex>
      <PastMovesList
        moves={pastMoves}
        start={wordPair[0]}
        goal={wordPair[1]}
        maxMoves={maxMoves}
      />
      <Flex direction="column" alignItems="center" mt="4">
        <Flex width="100%" alignItems="center" justifyContent="center">
          <Input
            placeholder="enter new word"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            width="200px"
          />
          <Button
            onClick={handleButtonClick}
            ml={2}
          >
            Enter
          </Button>
        </Flex>
        {errorMessage && <Box mt={3}>{errorMessage}</Box>}
      </Flex>
      <Box p="3" mt="2" textAlign="center">
        <GetDefinition word={currentWord} />
      </Box>
    </Flex>
  );
};

export default WordPair;
