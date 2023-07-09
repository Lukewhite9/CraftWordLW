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
  const [allRoundData, setAllRoundData] = useState<Round[]>([]);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);

  const loadGameData = useCallback(async () => {
    console.log('Loading game data...');

    const roundsData = await getNewWordPairAPI(gameLength);

    console.log('Loaded game data:', roundsData);

    if (!roundsData) {
      // Handle error case
      return;
    }

    const rounds: Round[] = roundsData.map((roundData) => ({
      ...roundData,
      maxMoves: roundData.pathLength + 1,
      moves: [],
    }));

    setAllRoundData(rounds);
  }, [gameLength]);

  const newRound = useCallback((roundsNumber: number) => {
    const roundData = allRoundData[roundsNumber - 1];
    return roundData;
  }, [allRoundData]);

  useEffect(() => {
    if (gameLength) {
      loadGameData();
    }
  }, [gameLength, loadGameData]);

  const addRound = useCallback((roundData: Round) => {
    setRounds((prevRounds) => [...prevRounds, roundData]);
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
    const round = newRound(rounds.length + 1);
    if (round) {
      addRound(round);
    }
  }}
/>
      )}
    </div>
  );
};

export default GameWrapper;
