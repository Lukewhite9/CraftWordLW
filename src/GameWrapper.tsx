import React, { useState, useEffect, useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import { getNewWordPair, getRandomWordPair } from './utils';
import Game from './Game';
import { fetchScores } from './api';

type GameWrapperProps = {
  wordList: string[];
  gameLength: number | null;
};

export type Round = {
  startWord: string;
  goalWord: string;
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

  const fetchNewWordPair = async (roundNumber: number) => {
    try {
      let newWordPair;
      if (gameLength) {
        newWordPair = await getNewWordPair(roundNumber);
      } else {
        newWordPair = await getRandomWordPair(roundNumber);
      }
      return newWordPair;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (rounds.length === 0) {
      fetchNewWordPair(1).then((pair) => pair && addRound(pair));
    }
  }, [rounds.length, fetchNewWordPair]);

  useEffect(() => {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    fetchScores(date)
      .then(data => setLeaderboard(data))
      .catch(err => console.error('Error fetching scores:', err));
  }, []);

  const addRound = useCallback((wordPair: string[]) => {
    const newRound: Round = {
      startWord: wordPair[0],
      goalWord: wordPair[1],
      moves: [],
    };
    setRounds([...rounds, newRound]);
  }, [rounds]);

  const updateCurrentRound = useCallback((updateRound: Round) => {
    setRounds((prevRounds) => {
      const updatedRounds = [...prevRounds];
      updatedRounds[updatedRounds.length - 1] = updateRound;
      return updatedRounds;
    });
  }, []);

  const currentRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  const isRoundOver = currentRound && currentRound.moves[currentRound.moves.length - 1] === currentRound.goalWord;
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
            fetchNewWordPair(rounds.length + 1).then((pair) => pair && addRound(pair))
          }}
        />
      )}
    </div>
  );
};

export default GameWrapper;
