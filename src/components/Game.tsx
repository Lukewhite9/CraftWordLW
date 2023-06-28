import React, { useState, useCallback, useEffect } from 'react';
import { Flex, useDisclosure, Text } from '@chakra-ui/react';
import WordPair from './WordPair';
import { isValidTransformation, isValidWord } from '../utils/utils';
import GameOverModal from "./GameOverModal";
import RoundModal from "./RoundModal";
import { Round, Score } from "./GameWrapper";
import { saveHighScore, retrieveHighScore } from '../api/api';

type GameProps = {
  currentRound: Round;
  updateCurrentRound: (round: Round) => void;
  wordList: string[];
  rounds: Round[];
  leaderboard: Score[];
  setLeaderboard: (scores: Score[]) => void;
  isRoundOver: boolean;
  isGameOver: boolean;
  onContinue: () => void;
};

const Game: React.FC<GameProps> = ({
  currentRound,
  updateCurrentRound,
  wordList,
  rounds,
  leaderboard,
  setLeaderboard,
  isRoundOver,
  isGameOver,
  onContinue,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { startWord, goalWord, moves } = currentRound;
  const currentWord = moves.length > 0 ? moves[moves.length - 1] : startWord;

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
      let newErrorMessage = "";

      if (validTransformation && validWord && !isSameWord) {
        clearInput();
        updateCurrentRound({
          ...currentRound,
          moves: [...currentRound.moves, userInput.toLowerCase()],
        });
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
    [currentWord, wordList, currentRound, updateCurrentRound]
  );


  useEffect(() => {
    const saveAndRetrieveScores = async () => {
      if (isGameOver) {
        !isEndModalOpen && onEndModalOpen();
        const unixTimestamp = Math.floor(new Date().getTime() / 1000);
        localStorage.setItem('lastPlayed', JSON.stringify(unixTimestamp));
        const newScore: Score = {
          name: '', // Player name will be entered in the GameOverModal
          score: currentRound.moves.length,
          time: totalTime
        };
        await saveHighScore(newScore);
        const scores = await retrieveHighScore();
        setLeaderboard(scores);
      }
    };

    saveAndRetrieveScores();

    if (isGameOver) {
      // Existing game over logic
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
    currentRound,
    setLeaderboard
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
        maxMoves={currentRound.maxMoves}
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
        leaderboard={leaderboard}
        setLeaderboard={setLeaderboard}
      />
    </Flex>
  );
};

export default Game;
