import React, { useState, useCallback, useEffect } from 'react';
import { Flex, useDisclosure } from '@chakra-ui/react';
import WordPair from './WordPair';
import { isValidTransformation, isValidWord } from './utils';
import GameOverModal from "./GameOverModal";
import RoundModal from "./RoundModal";
import { Round } from "./GameWrapper";

type GameProps = {
  handleRoundOver: (roundScore: number) => void;
  currentRound: any; // replace any with your type
  updateCurrentRound: (round: any) => void; // replace any with your type
  wordList: string[];
  rounds: Round[];
  isRoundOver: boolean;
  isGameOver: boolean;
  onContinue: () => void;
};

const Game: React.FC<GameProps> = ({
  handleRoundOver,
  currentRound,
  updateCurrentRound,
  wordList,
  rounds,
  isRoundOver,
  isGameOver,
  onContinue,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { startWord, goalWord, moves } = currentRound;
  const currentWord = moves.length > 0 ? moves[moves.length - 1] : startWord;

  // modal state controls
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEndModalOpen,
    onOpen: onEndModalOpen,
    onClose: onEndModalClose
  } = useDisclosure();

  const checkTransformation = useCallback(
    (userInput: string, clearInput: () => void) => {
      const validTransformation = isValidTransformation(currentWord, userInput);
      const validWord = isValidWord(userInput, wordList);
      const isSameWord = currentWord === userInput;

      if (validTransformation && validWord && !isSameWord) {
        clearInput();
        updateCurrentRound({
          ...currentRound,
          moves: [...currentRound.moves, userInput.toLowerCase()],
        });
        setErrorMessage(null);
      } else {
        clearInput();
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

  useEffect(() => {
    if (isGameOver) {
      !isEndModalOpen && onEndModalOpen();
    } else if (isRoundOver) {
      !isOpen && onOpen();
    } else {
      isOpen && onClose();
    }
  }, [
    isRoundOver,
    isGameOver,
    isOpen,
    onOpen,
    onClose,
    isEndModalOpen,
    onEndModalOpen,
    onEndModalClose
  ]);

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
      <RoundModal
        isOpen={isOpen}
        onClose={onClose}
        onContinue={onContinue}
        score={currentRound.moves.length}
      />
      <GameOverModal
        isOpen={isEndModalOpen}
        onClose={onEndModalClose}
        totalScore={rounds.reduce((acc, curr) => acc + curr.moves.length, 0)}
      />
    </Flex>
  );
};


export default Game;
