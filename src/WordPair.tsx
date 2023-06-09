import React, { useState, ChangeEvent } from "react";
import { Text, Box, Flex, Input, Wrap, WrapItem } from "@chakra-ui/react";
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
      direction="column"
      justifyContent="space-between"
      border="1px solid"
      borderColor="transparent"
      borderRadius="base"
    >
      <Flex direction="row" alignItems="baseline">
        <Box textAlign="left">
          <Text fontSize="xl">{wordPair[0]}</Text>
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
          <Text fontSize="xl">{wordPair[1]}</Text>
        </Box>
      </Flex>
      <Flex direction="column" alignItems="center" mt="4">
        <Box textAlign="center" mb="4">
          <CurrentWord currentWord={currentWord} />
        </Box>
        <Box flexGrow={1}>
          <Input
            placeholder="enter new word here"
            width="250px"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            sx={{
              "&::placeholder": {
                textAlign: "center",
              },
              textTransform: "lowercase"
            }}
          />
          {errorMessage && <div>{errorMessage}</div>}
        </Box>
      </Flex>
      <Box my="4" textAlign="center">
        <Box >
          <Text fontSize="sm" textAlign="left" mt="0.5"color="gray.400">
            <Text as="span" fontWeight="bold">
              placeholder
              <br />
            </Text>
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
      </Box>
    </Flex>
  );
};

export default WordPair;
