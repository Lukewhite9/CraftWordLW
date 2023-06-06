import { Text, Box, Flex, Input } from "@chakra-ui/react";
import { useState, ChangeEvent } from "react";
import CurrentWord from './CurrentWord';

type GameDisplayProps = {
  wordPair: string[];
  onSubmitWord: (word: string, callback: any) => void;
  currentWord: string;
  pastMoves: string[];
};

const GameDisplay: React.FC<GameDisplayProps> = ({
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
      direction="column"
      alignItems="center"
      border="1px solid"
      borderColor="gray.100"
      borderRadius="base" p="4"
    >
      <Flex>
        <Box mx="2">
          <Text fontSize="2xl" color="red">
            START
          </Text>
          <Text fontWeight="bold" fontSize="3xl">
            {wordPair[0]}
          </Text>
        </Box>
        <Box mx="2">
          <Text fontSize="2xl" color="green">
            GOAL
          </Text>
          <Text fontWeight="bold" fontSize="3xl">
            {wordPair[1]}
          </Text>
        </Box>
      </Flex>
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
      <Flex direction="row" align="flex-start">
        {pastMoves.length === 0 && (
          <Text fontSize="l" color="gray">
            PAST MOVES
          </Text>
        )}
        <Flex direction="column">
          {!!pastMoves
            && pastMoves.length > 0
            && pastMoves.map((word, i) => (
              <Box key={`${word}-${i}`}>{word}</Box>
            ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GameDisplay;
