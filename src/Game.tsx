import React, { useState, useCallback, useEffect } from 'react';
import { Flex, useDisclosure, Text } from '@chakra-ui/react';
import WordPair from './WordPair';
import { isValidTransformation, isValidWord } from './utils';
import GameOverModal from "./GameOverModal";
import RoundModal from "./RoundModal";
import { Round } from "./GameWrapper";

type GameProps = {
  currentRound: any; // replace any with your type
  updateCurrentRound: (round: any) => void; // replace any with your type
  wordList: string[];
  rounds: Round[];
  isRoundOver: boolean;
  isGameOver: boolean;
  onContinue: () => void;
};

const Game: React.FC<GameProps> = ({
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

  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

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
          setErrorMessage("Nope, not a valid English word. Try again.");
        } else if (isSameWord) {
          setErrorMessage("Nope, try to change the word.");
        } else {
          setErrorMessage("Nope, that change is not allowed. Try again.");
        }
      }
    },
    [currentWord, wordList, currentRound, updateCurrentRound]
  );

  useEffect(() => {
    const saveHighScore = async () => {
      try {
        const response = await fetch('https://back-end.lukewhite9.repl.co/leaderboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Player Name', // Replace 'Player Name' with the actual player name
            score: currentRound.moves.length,
            time: totalTime,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Failed to save high score');
        }
      } catch (error) {
        console.error(error);
      }
    };

    const retrieveHighScore = async () => {
      try {
        const response = await fetch('https://back-end.lukewhite9.repl.co/leaderboard');
        if (response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          console.error('Failed to retrieve high score');
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isGameOver) {
      !isEndModalOpen && onEndModalOpen();
      const unixTimestamp = Math.floor(new Date().getTime() / 1000);
      localStorage.setItem('lastPlayed', JSON.stringify(unixTimestamp));
      saveHighScore();
      retrieveHighScore();
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
    onEndModalClose,
    currentRound.moves.length,
    totalTime,
  ]);

  useEffect(() => {
    if (!isGameOver && !isRoundOver) {
      setStartTime(Date.now());
    }
  }, [isGameOver, isRoundOver]);

  useEffect(() => {
    if (isRoundOver || isGameOver) {
      const endTime = Date.now();
      setTotalTime((endTime - startTime) / 1000); // get the time in seconds
    }
  }, [isRoundOver, isGameOver]);

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
        <Text fontSize="sm" color="green">
          START
        </Text>
        <Text ml="3">
          round: {rounds.length}  score: {currentRound?.moves.length || 0}
        </Text>
        <Text fontSize="sm" color="blue">
          GOAL
        </Text>
      </Flex>
      <WordPair
        wordPair={[startWord, goalWord]}
        onSubmitWord={checkTransformation}
        currentWord={currentWord}
        pastMoves={moves}
        errorMessage={errorMessage}
      />
      <RoundModal
        isOpen={isOpen}
        onClose={onClose}
        onContinue={onContinue}
        score={currentRound.moves.length}
        time={totalTime}
      />
      <GameOverModal
        isOpen={isEndModalOpen}
        onClose={onEndModalClose}
        totalScore={rounds.reduce((acc, curr) => acc + curr.moves.length, 0)}
        totalTime={totalTime}
      />
    </Flex>
  );
};

export default Game;
