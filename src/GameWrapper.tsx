import React, { useState, useEffect, useCallback } from 'react';
import { Heading, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { getNewWordPair, getRandomWordPair } from './utils';
import Game from './Game';
import GameOverModal from './GameOverModal';
import RoundModal from './RoundModal';

type GameWrapperProps = {
  wordList: string[];
  isPracticeMode: boolean;
};

type Round = {
  startWord: string;
  goalWord: string;
  moves: string[];
};

const GameWrapper: React.FC<GameWrapperProps> = ({ wordList, isPracticeMode }) => {
  // Removed roundOver from the state
  const [rounds, setRounds] = useState<Round[]>([]);
  const { isOpen: roundModalOpen, onOpen: openRoundModal, onClose: closeRoundModal } = useDisclosure();
  const { isOpen: gameOverModalOpen, onOpen: openGameOverModal } = useDisclosure();

  // new state for total score
  const [totalScore, setTotalScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const currentRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
// Set gameLength to null in practice mode to allow indefinite gameplay
  const [gameLength, setGameLength] = useState<number | null>(isPracticeMode ? null : 5);
  const addRound = useCallback((startWord: string, goalWord: string) => {
    const newRound: Round = { startWord, goalWord, moves: [] };
    setRounds([...rounds, newRound]);
  }, [rounds, setRounds]);

  const fetchNewWordPair = useCallback(async () => {
    try {
      let newWordPair;
      if (!isPracticeMode) {
        newWordPair = await getNewWordPair(rounds.length + 1);
      } else {
        newWordPair = await getRandomWordPair(rounds.length + 1);
      }
      const startWord = newWordPair[0];
      const goalWord = newWordPair[1];
      addRound(startWord, goalWord);
    } catch (error) {
      console.error(error);
    }
  }, [rounds.length, isPracticeMode, addRound]);

  useEffect(() => {
    if (rounds.length === 0) {
      fetchNewWordPair();
    }
  }, [rounds.length, fetchNewWordPair]);

  const updateCurrentRound = useCallback((updateRound: Round) => {
    setRounds((prevRounds) => {
      const updatedRounds = [...prevRounds];
      updatedRounds[updatedRounds.length - 1] = updateRound;
      return updatedRounds;
    });
  }, []);

  const handleRoundOver = useCallback((roundScore: number) => {
  setRoundScores(prevScores => [...prevScores, roundScore]);
  setTotalScore(totalScore + roundScore);
  if (!isPracticeMode && rounds.length === gameLength) {
    openGameOverModal();
  } else {
    openRoundModal();
  }
}, [rounds, gameLength, totalScore, setTotalScore, openGameOverModal, openRoundModal]);


  const handleContinue = useCallback(() => {
  fetchNewWordPair();  // start new round
  closeRoundModal();  // close RoundModal
}, [closeRoundModal, fetchNewWordPair]);

  return (
  <div>
    <Flex justifyContent="center" alignItems="center" direction="column">
      <Heading size="lg">Round {rounds.length}</Heading>
      <Text ml="3">Current Score: {currentRound?.moves.length || 0}</Text>
    </Flex>
    {currentRound && (
      <Game
        currentRound={currentRound}
        updateCurrentRound={updateCurrentRound}
        wordList={wordList}
        rounds={rounds}
        handleRoundOver={handleRoundOver} 
        RoundModal={RoundModal}
        GameOverModal={GameOverModal}
        totalScore={totalScore}
        gameLength={gameLength}
        setGameLength={setGameLength}
      />
    )}
    <GameOverModal
      isOpen={gameOverModalOpen}
      onClose={handleContinue}
      currentRoundMoves={currentRound?.moves || []}
    />
    <RoundModal
      isOpen={roundModalOpen}
      onClose={handleContinue}
      roundScore={roundScore}
      currentRoundMoves={currentRound?.moves || []}
    />
  </div>
);
};

export default GameWrapper;
