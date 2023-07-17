import React, { useState, useEffect, useCallback } from 'react';
import { Text, Button } from '@chakra-ui/react';
import Round from './Round';
import { fetchGameRounds, fetchRandomRound } from '../api/api';

const PRACTICE_MODE_DIFFICULTY = 1;

type GameProps = {
  wordList: string[];
  gameLength: number | null;
};

export type Round = {
  startWord: string;
  goalWord: string;
  moves: string[];
  startedAt: any;
  completedAt: any;
};

export type Score = {
  name: string;
  score: number;
  time: number;
};

const Game: React.FC<GameProps> = ({ wordList, gameLength }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number | null>(null);
  const [maxMoves, setMaxMoves] = useState<number>(gameLength === null ? Infinity : 0);

  const fetchRoundData = useCallback(async (roundIndex: number) => {
    if (gameLength === null) {
      const roundData = await fetchRandomRound(roundIndex + 1, PRACTICE_MODE_DIFFICULTY);
      if (roundData) {
        const newRound = {
          ...roundData,
          moves: [],
          startedAt: Date.now(),
          completedAt: null,
        };
        setRounds((prevRounds) => [...prevRounds, newRound]);
        setMaxMoves(Infinity);
      }
    } else if (roundIndex === 0) {
      const gameData = await fetchGameRounds();
      const newRounds = gameData.rounds.map((roundData: any) => ({
        ...roundData,
        maxMoves: parseInt(roundData.pathLength) + 1,
        moves: [],
        startedAt: Date.now(),
        completedAt: null,
      }));
      setRounds(newRounds); 
      setMaxMoves(parseInt(gameData.rounds[0].pathLength) + 1);
    } else {
      const gameData = await fetchGameRounds();
      const nextRound = gameData.rounds[roundIndex];
      if (nextRound) {
        const newRound = {
          ...nextRound,
          maxMoves: parseInt(nextRound.pathLength) + 1,
          moves: [],
          startedAt: Date.now(),
          completedAt: null,
        };
        setRounds((prevRounds) => [...prevRounds, newRound]);
      }
    }
  }, [gameLength]);

  const startGame = useCallback(() => {
    fetchRoundData(0);
    setCurrentRoundIndex(0);
  }, [fetchRoundData]);

  useEffect(() => {
    if (currentRoundIndex === null) {
      startGame();
    }
  }, [currentRoundIndex, startGame]);

  const advanceRound = useCallback(() => {
  const nextRoundIndex = currentRoundIndex !== null ? currentRoundIndex + 1 : 0;
  setCurrentRoundIndex(nextRoundIndex);
  if (gameLength !== null && nextRoundIndex < gameLength) {
    fetchRoundData(nextRoundIndex);
  }
  setRounds(prevRounds => prevRounds.map((round, index) => {
    if (index === nextRoundIndex) {
      return { ...round, startedAt: Date.now() };
    } else {
      return round;
    }
  }));
}, [currentRoundIndex, fetchRoundData, gameLength]);

  const addMove = useCallback((move: string) => {
    if (currentRoundIndex !== null) {
      setRounds((prevRounds) => {
        const updatedRounds = [...prevRounds];
        const newRound = updatedRounds[currentRoundIndex];
        newRound.moves.push(move);
        if (move === newRound.goalWord || newRound.maxMoves + 1 === newRound.moves.length) {
          newRound.completedAt = Date.now();
        }
        updatedRounds[currentRoundIndex] = newRound;
        return updatedRounds;
      });
    }
  }, [setRounds, currentRoundIndex, maxMoves]);

  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  const isRoundWon = isRoundOver && currentRound.moves.includes(currentRound.goalWord);

  const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds :     seconds}`;
};

  return (
    <div>
      {currentRound && !isRoundOver && (
        <>
          {currentRoundIndex !== null && (<Text>Round: {currentRoundIndex + 1}</Text>)}
          <Round 
            startWord={currentRound.startWord}
            goalWord={currentRound.goalWord}
            moves={currentRound.moves}
            maxMoves={maxMoves}
            wordList={wordList}
            addMove={addMove}
          />
        </>
      )}
      {isRoundOver && (
        <>
          {isRoundWon ? (
            <Text mt="5">
              Nicely done!
          You finished in {currentRound.moves.length} moves. 
              Your time to complete round {currentRoundIndex + 1} was {formatTime((currentRound.completedAt - currentRound.startedAt) / 1000)}.

            </Text>
          ) : (
            <Text mt="5">You have exceeded the maximum moves. Try again!</Text>
          )}
          {gameLength === null || (currentRoundIndex !== null && currentRoundIndex + 1 < gameLength) ? (
            <Button mt="3" onClick={advanceRound}>Next Round</Button>
          ) : (
            <Text mt="3">You have completed all rounds! Good job!</Text>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
