import React, { useState } from "react";
import { Text, Box, Flex, Input, Button } from "@chakra-ui/react";
import Definition from './Definition';
import RoundMoves from './RoundMoves';

type RoundDisplayProps = {
  wordPair: string[];
  onSubmitWord: (userInput: string, clearInput: () => void) => void;
  currentWord: string;
  pastMoves: string[];
  maxMoves: number | null;
  errorMessage: string | null;
};

const RoundDisplay: React.FC<RoundDisplayProps> = ({
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
        <Box flex="1" textAlign="left">
          <Text mb="2" textColor="green.500" fontWeight="bold" fontSize="x-large">{wordPair[0]}</Text>
        </Box>
        <Box flex="1" textAlign="right">
          <Text textColor="blue.500" fontWeight="bold" fontSize="x-large">{wordPair[1]}</Text>
        </Box>
      </Flex>


      <RoundMoves
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
        <Definition word={currentWord} />
      </Box>
    </Flex>
  );
};

export default RoundDisplay;
