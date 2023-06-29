import React, { useState, useEffect, useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import { getNewWordPairAPI, getRandomWordPair } from '../utils/utils';
import Game from './Game';
import { fetchScores } from '../api/api';

type GameWrapperProps = {
  wordList: string[];
  gameLength: number | null;
};

export type Round = {
  startWord: string;
  goalWord: string;
  maxMoves: number;
  moves: string[];
};

export type Score = {
  name: string;
  score: number;
  time: number;
};

const GameWrapper: React.FC<GameWrapperProps> = ({ wordList, gameLength }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);

  const newRound = useCallback(async (roundsNumber: number) => {
    let roundsData: any[];
    try {
      if (gameLength) {
        roundsData = await getNewWordPairAPI(roundsNumber);
      } else {
        roundsData = Array(roundsNumber).fill(0).map((_, i) => getRandomWordPair(i + 1));
        roundsData = await Promise.all(roundsData);
      }
      return roundsData;
    } catch (error) {
      console.error(error);
    }
  }, [gameLength]);

  const addRound = useCallback((roundData: { startWord: string, goalWord: string, pathLength: number }) => {
    const newRound: Round = {
      ...roundData,
      maxMoves: roundData.pathLength + 1,
      moves: [],
    };
    setRounds(prevRounds => [...prevRounds, newRound]);
  }, []);

  useEffect(() => {
    if (gameLength && rounds.length < gameLength) {
      newRound(gameLength).then((roundsData) => {
        roundsData && roundsData.forEach((round) => addRound(round));
      });
    }
  }, [rounds.length, newRound, gameLength, addRound]);

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    fetchScores(date)
      .then(data => setLeaderboard(data))
      .catch(err => console.error('Error fetching scores:', err));
  }, []);

  const updateCurrentRound = useCallback((updateRound: Round) => {
    setRounds((prevRounds) => {
      const updatedRounds = [...prevRounds];
      updatedRounds[updatedRounds.length - 1] = updateRound;
      return updatedRounds;
    });
  }, []);

  const currentRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const isRoundOver = currentRound && (currentRound.moves[currentRound.moves.length - 1] === currentRound.goalWord || currentRound.moves.length === currentRound.maxMoves);
  const isGameOver = isRoundOver && rounds.length === gameLength;

  return (
    <div>
      <Flex
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
      </Flex>
      {currentRound && (
        <Game
  currentRound={currentRound}
  updateCurrentRound={updateCurrentRound}
  wordList={wordList}
  rounds={rounds}
  leaderboard={leaderboard}
  setLeaderboard={setLeaderboard}
  isRoundOver={!!isRoundOver}
  isGameOver={!!isGameOver}
  onContinue={() => {
    if (rounds.length < gameLength) {
      newRound(gameLength - rounds.length).then((roundsData) => {
        roundsData && roundsData.forEach((round) => addRound(round));
      });
    }
  }}
/>

      )}
    </div>
  );
};

export default GameWrapper;
