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

  const loadGameData = useCallback(async () => {
  const roundsData = await getNewWordPairAPI(rounds.length + 1);

    if (!roundsData) {
      // Handle error case
      return;
    }

    roundsData.forEach((round) => addRound(round));
  }, [gameLength]);

  const newRound = useCallback(async (roundsNumber: number) => {
  // Call loadGameData to fetch the game data if it hasn't been loaded yet
  if (rounds.length === 0) {
    await loadGameData();
  }

  // Retrieve the data for the current round
  const roundData = rounds[roundsNumber - 1];

  // Return the round data
  return roundData;
}, [rounds.length, loadGameData]);


  useEffect(() => {
    if (gameLength && rounds.length < gameLength) {
      // Load the game data initially
      loadGameData();
    }
  }, [rounds.length, gameLength, loadGameData]);

  const addRound = useCallback((roundData: { startWord: string, goalWord: string, pathLength: number }) => {
    const newRound: Round = {
      ...roundData,
      maxMoves: roundData.pathLength + 1,
      moves: [],
    };
    setRounds((prevRounds) => [...prevRounds, newRound]);
  }, []);

  const updateCurrentRound = useCallback((updateRound: Round) => {
    setRounds((prevRounds) => {
      const updatedRounds = [...prevRounds];
      updatedRounds[updatedRounds.length - 1] = updateRound;
      return updatedRounds;
    });
  }, []);

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    fetchScores(date)
      .then(data => setLeaderboard(data))
      .catch(err => console.error('Error fetching scores:', err));
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
            newRound(rounds.length + 1).then((round) => round && addRound(round))
          }}
        />
      )}
    </div>
  );
};

export default GameWrapper;
