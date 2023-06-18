import React, { useState, ChangeEvent } from "react";
import { Text, Box, Flex, Input, Wrap, WrapItem, Button } from "@chakra-ui/react";
import CurrentWord from './CurrentWord';
import GetDefinition from './GetDefinition';

type WordPairProps = {
  wordPair: string[];
  onSubmitWord: (userInput: string, clearInput: () => void) => void;

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
        <Wrap spacing="12px" marginLeft="12px" marginRight="12px" align="start">
          {pastMoves.map((word, i) => (
            <WrapItem key={`${word}-${i}`}>
              <Text fontSize="19px">
                {word}
              </Text>
            </WrapItem>
          ))}
        </Wrap>
        <Box marginLeft="auto" textAlign="right">
          <Text fontWeight="bold" fontSize="xl">{wordPair[1]}</Text>
        </Box>
      </Flex>
      <Flex direction="column" alignItems="center" mt="4">
  <Box textAlign="center" mb="4">
    <CurrentWord currentWord={currentWord} />
  </Box>
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
      enter
    </Button>
  </Flex>
  <Box mt={3} height="25px">{errorMessage}</Box> 
</Flex>

      <Box 
          p={3}
          mt="2" 
          textAlign="center">
        <GetDefinition word={currentWord} />
      </Box>
    </Flex>
  );
};

export default WordPair;

