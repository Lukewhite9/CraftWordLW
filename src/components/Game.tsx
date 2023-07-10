import React, { useState, useCallback, useEffect } from 'react';
import { Flex, useDisclosure, Text } from '@chakra-ui/react';
import WordPair from './WordPair';
import { isValidTransformation, isValidWord } from '../utils/utils';
import GameOverModal from "./GameOverModal";
import RoundModal from "./RoundModal";
import { Score } from "./GameWrapper";
import { saveHighScore, retrieveHighScore } from '../api/api';

type GameProps = {
  startWord: string;
  goalWord: string;
  moves: string[];
  maxMoves: number;
  updateCurrentRound: (move: string) => void;
  wordList: string[];
  onContinue: () => void;
};

const Game: React.FC<GameProps> = ({
  startWord,
  goalWord,
  moves,
  maxMoves,
  updateCurrentRound,
  wordList, // TODO: we shouldn't need to pass the wordList
  onContinue,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const currentWord = moves.length > 0 ? moves[moves.length - 1] : startWord;

  const {
    isOpen: isRoundOverModalOpen,
    onOpen: onRoundOverModalOpen,
    onClose: onRoundOverModalClose
  } = useDisclosure();
  const {
    isOpen: isGameOverModalOpen,
    onOpen: onGameOverModalOpen,
    onClose: onGameOverModalClose
  } = useDisclosure();

  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const checkTransformation = useCallback(
    (userInput: string, clearInput: () => void) => {
      const validTransformation = isValidTransformation(currentWord, userInput);
      const validWord = isValidWord(userInput, wordList);
      const isSameWord = currentWord === userInput;
      let newErrorMessage = "";

      console.log(userInput, validWord, isSameWord)

      if (validTransformation && validWord && !isSameWord) {
        clearInput();
        updateCurrentRound(userInput.toLowerCase());
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
    [currentWord, wordList, updateCurrentRound]
  );


  // useEffect(() => {
  //   const saveAndRetrieveScores = async () => {
  //     if (isGameOver) {
  //       !isGameOverModalOpen && onGameOverModalOpen();
  //       const unixTimestamp = Math.floor(new Date().getTime() / 1000);
  //       localStorage.setItem('lastPlayed', JSON.stringify(unixTimestamp));
  //       const newScore: Score = {
  //         name: '', // Player name will be entered in the GameOverModal
  //         score: currentRound.moves.length,
  //         time: totalTime
  //       };
  //       await saveHighScore(newScore);
  //       const scores = await retrieveHighScore();
  //       setLeaderboard(scores);
  //     }
  //   };

  //   saveAndRetrieveScores();

  //   if (isGameOver) {
  //     // Existing game over logic
  //   } else if (isRoundOver) {
  //     !isRoundOverModalOpen && onRoundOverModalOpen();
  //   } else {
  //     isRoundOverModalOpen && onRoundOverModalClose();
  //   }
  // }, [
  //   isRoundOver,
  //   isGameOver,
  //   isRoundOverModalOpen,
  //   onRoundOverModalOpen,
  //   onRoundOverModalClose,
  //   isGameOverModalOpen,
  //   onGameOverModalOpen,
  //   onGameOverModalClose,
  //   currentRound.moves.length,
  //   totalTime,
  //   currentRound,
  //   setLeaderboard
  // ]);

  // useEffect(() => {
  //   if (!isGameOver && !isRoundOver) {
  //     setStartTime(Date.now());
  //   }
  // }, [isGameOver, isRoundOver]);

  // useEffect(() => {
  //   if (isRoundOver || isGameOver) {
  //     const endTime = Date.now();
  //     setTotalTime((endTime - startTime) / 1000); // get the time in seconds
  //   }
  // }, [isRoundOver, isGameOver]);

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
      <WordPair
        wordPair={[startWord, goalWord]}
        onSubmitWord={checkTransformation}
        currentWord={currentWord}
        pastMoves={moves}
        maxMoves={maxMoves}
        errorMessage={errorMessage}
      />
      {/* <GameOverModal
        isOpen={isGameOverModalOpen}
        onClose={onGameOverModalClose}
        totalScore={rounds.reduce((acc, curr) => acc + curr.moves.length, 0)}
        totalTime={totalTime}
        leaderboard={leaderboard}
        setLeaderboard={setLeaderboard}
      /> */}
    </Flex>
  );
};

export default Game;
