import React, { useState, useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import WordPair from './WordPair';
import { isValidTransformation, isValidWord } from './utils';
import { Round } from "./GameWrapper";

type GameProps = {
  handleRoundOver: (roundScore: number) => void;
  currentRound: any; // replace any with your type
  updateCurrentRound: (round: any) => void; // replace any with your type
  wordList: string[];
  rounds: any[]; // replace any with your type
  gameLength: number;
  RoundModal: any; // replace any with your type
  GameOverModal: any; // replace any with your type
  totalScore: number;
  setGameLength: React.Dispatch<React.SetStateAction<number | null>>;
};

const Game: React.FC<GameProps> = ({
  handleRoundOver,
  currentRound,
  updateCurrentRound,
  wordList,
  rounds,
  gameLength,
  RoundModal,
  GameOverModal,
  totalScore,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [roundOver, setRoundOver] = useState(false); // Add this line
  const isPracticeMode = gameLength === null; // Add this line
  const { startWord, goalWord, moves } = currentRound;
  const currentWord = moves.length > 0 ? moves[moves.length - 1] : startWord;

  const checkTransformation = useCallback(
    (userInput: string, callback: () => void) => {
      const validTransformation = isValidTransformation(currentWord, userInput);
      const validWord = isValidWord(userInput, wordList);
      const isSameWord = currentWord === userInput;

      if (validTransformation && validWord && !isSameWord) {
        callback();
        updateCurrentRound({
          ...currentRound!,
          moves: [...currentRound!.moves, userInput.toLowerCase()],
        });
        setErrorMessage(null);
        if (userInput.toLowerCase() === currentRound!.goalWord.toLowerCase()) {
          setRoundOver(true);
        }
      } else {
        callback();
        if (!validWord) {
          setErrorMessage("Nope. That's not a valid English word. Please try again.");
        } else if (isSameWord) {
          setErrorMessage("Nope, try to change the word.");
        } else {
          setErrorMessage("Nope, that word change is not allowed. Try again.");
        }
      }
    },
    [currentWord, wordList, currentRound, updateCurrentRound]
  );

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
      {roundOver && !isPracticeMode && rounds.length < gameLength && (
  <RoundModal
    isOpen={roundOver}
    onClose={() => {
      setRoundOver(false);
      handleRoundOver(currentRound.moves.length);
    }}
    roundScore={currentRound.moves.length}
  />
)}
{roundOver && !isPracticeMode && rounds.length === gameLength && (
  <GameOverModal
    isOpen={roundOver}
    onClose={() => {
      setRoundOver(false);
      handleRoundOver(currentRound.moves.length);
    }}
    totalScore={totalScore + currentRound.moves.length}
  />
)}
{roundOver && isPracticeMode && (
  <RoundModal
    isOpen={roundOver}
    onClose={() => {
      setRoundOver(false);
      handleRoundOver(currentRound.moves.length);
    }}
    roundScore={currentRound.moves.length}
  />
)}
    </Flex>
  );
};


export default Game;
