import React, { useState, useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import RoundDisplay from './RoundDisplay';
import { isValidTransformation, isValidWord } from '../../utils/utils';

type RoundProps = {
  startWord: string;
  goalWord: string;
  moves: string[];
  maxMoves: number | null;
  addMove: (move: string) => void;
  wordList: string[];
};

const Round: React.FC<RoundProps> = ({
  startWord,
  goalWord,
  moves,
  maxMoves,
  addMove,
  wordList, // TODO: we shouldn't need to pass the wordList
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentWord = moves.length > 0 ? moves[moves.length - 1] : startWord;

  const checkTransformation = useCallback(
    (userInput: string, clearInput: () => void) => {
      const validTransformation = isValidTransformation(currentWord, userInput);
      const validWord = isValidWord(userInput, wordList);
      const isSameWord = currentWord === userInput;
      let newErrorMessage = "";

      if (validTransformation && validWord && !isSameWord) {
        clearInput();
        addMove(userInput.toLowerCase());
        setErrorMessage(null);
      } else {
        clearInput();
        if (!validWord && !validTransformation) {
          newErrorMessage = "Nope, that change is not allowed, and it's not a word in English.";
        } else if (!validWord) {
          newErrorMessage = "Nope, not a valid English word.";
        } else if (isSameWord) {
          newErrorMessage = "Nope, try to change the word.";
        } else if (!validTransformation) {
          newErrorMessage = "Nope, that change is not allowed.";
        }
        setErrorMessage(newErrorMessage.trim());
      }
    },
    [currentWord, wordList, addMove]
  );

  return (
    <Flex
      h="100%"
      w="100%"
      maxW="480px"
      display="flex"
      justifyContent="center"
      direction="column"
      position="relative"
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
      </Flex>
      <RoundDisplay
        wordPair={[startWord, goalWord]}
        onSubmitWord={checkTransformation}
        currentWord={currentWord}
        pastMoves={moves}
        maxMoves={maxMoves}
        errorMessage={errorMessage}
      />
    </Flex>
  );
};

export default Round;
