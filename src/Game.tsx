import React, { useState, useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import WordPair from './WordPair';
import { isValidTransformation, isValidWord } from './utils';
import { Round } from "./GameWrapper";

const wordPairs = [
  {
    par: 2,
    startWord: "at",
    goalWord: "ate",
    paths: [
      ["at", "ate"],
      ["at", "mat", "mate", "ate"]
    ]
  }
];

type GameProps = {
  currentRound: Round;
  updateCurrentRound: (round: Round) => void;
  wordList: string[];
};

const Game: React.FC<GameProps> = ({
  currentRound,
  updateCurrentRound,
  wordList,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { startWord, goalWord, moves } = currentRound;
  const currentWord = moves.length > 0 ? moves[moves.length - 1] : startWord;

  const checkTransformation = useCallback((userInput: string, callback: any) => {
    // check if move is legal
    const validTransformation = isValidTransformation(currentWord, userInput);
    const validWord = isValidWord(userInput, wordList);

    // if so update the round with new word and clear error
    // parent handles checking if the round/game is over
    if (validTransformation && validWord) {
      callback();
      updateCurrentRound({
        ...currentRound,
        moves: [...moves, userInput.toLowerCase()]
      });
      setErrorMessage(null);
    } else {
      if (!validWord) {
        setErrorMessage(
          "Nope. That's not a valid English word. Please try again."
        );
      } else {
        setErrorMessage(
          "Nope, that word change is not allowed. Try again."
        );
      }
    }
  }, [moves, currentWord, wordList]);

  return (
    <Flex
      h="100%"
      w="100%"
      maxW="600px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      direction="column"
      position="relative"
    >
      <WordPair
        wordPair={[startWord, goalWord]}
        onSubmitWord={checkTransformation}
        currentWord={currentWord}
        pastMoves={moves}
      />
      <Flex direction="column" alignItems="center" my="4">
        {errorMessage && <div>{errorMessage}</div>}
      </Flex>
    </Flex>
  );
};

export default Game;
