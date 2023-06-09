import React, { useState, ChangeEvent } from "react";
import { Text, Box, Flex, Input, Wrap, WrapItem, Button } from "@chakra-ui/react";
import CurrentWord from './CurrentWord';
import game from './game';
import GetDefinition from './GetDefinition';

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
            sx={{
            "&::placeholder": {
                textAlign: "center",
            },
            textTransform: "lowercase"
            }}
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

      <Box my="4" textAlign="center">
        <GetDefinition word={currentWord} />
      </Box>
    </Flex>
  );
};

export default WordPair;
