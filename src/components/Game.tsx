import React, { useState, useEffect, useCallback } from 'react';
import { Text, Button } from '@chakra-ui/react';
import Round from './Round';
import { fetchGameRounds, fetchRandomRound } from '../api/api';
import { formatTime } from '../utils/utils';

const PRACTICE_MODE_DIFFICULTY = 1;

type GameProps = {
  wordList: string[];
  gameLength: number | null;
};

export type Round = {
  startWord: string;
  goalWord: string;
  moves: string[];
  maxMoves: number | null;
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
  const isPracticeMode = gameLength === null;

  const fetchGameData = useCallback(async () => {
    const gameData = await fetchGameRounds();
    const newRounds = gameData.rounds.map((roundData: any) => ({
      ...roundData,
      maxMoves: parseInt(roundData.pathLength) + 1,
      moves: [],
      startedAt: Date.now(),
      completedAt: null,
    }));
    setRounds(newRounds);
  }, [gameLength]);

  const startGame = useCallback(() => {
    fetchGameData();
    setCurrentRoundIndex(0);
  }, [fetchGameData]);

  const addNewRandomRound = useCallback(async (roundIndex: number) => {
    const roundData = await fetchRandomRound(roundIndex + 1, PRACTICE_MODE_DIFFICULTY);
    if (roundData) {
      const newRound = {
        ...roundData,
        moves: [],
        maxMoves: null,
        startedAt: Date.now(),
        completedAt: null,
      };
      setRounds((prevRounds) => [...prevRounds, newRound]);
      setCurrentRoundIndex(roundIndex);
    }
  }, [fetchRandomRound, setRounds]);

  useEffect(() => {
    if (currentRoundIndex === null) {
      isPracticeMode ? addNewRandomRound(0) : startGame();
    }
  }, [currentRoundIndex, startGame, isPracticeMode]);

  const advanceRound = useCallback(() => {
    const nextRoundIndex = currentRoundIndex !== null ? currentRoundIndex + 1 : 0;
    if (isPracticeMode) {
      addNewRandomRound(nextRoundIndex);
    }
    setCurrentRoundIndex(nextRoundIndex);
  }, [currentRoundIndex, gameLength, isPracticeMode]);

  const addMove = useCallback((move: string) => {
    if (currentRoundIndex !== null) {
      setRounds((prevRounds) => {
        const updatedRounds = [...prevRounds];
        const newRound = updatedRounds[currentRoundIndex];
        newRound.moves.push(move);
        if (
          move === newRound.goalWord || (
            newRound.maxMoves && newRound.maxMoves + 1 === newRound.moves.length
          )
        ) {
          newRound.completedAt = Date.now();
        }
        updatedRounds[currentRoundIndex] = newRound;
        return updatedRounds;
      });
    }
  }, [setRounds, currentRoundIndex]);

  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  const isRoundWon = isRoundOver && currentRound.moves.includes(currentRound.goalWord);

  return (
    <div>
      {currentRound && !isRoundOver && (
        <>
          {currentRoundIndex !== null && (<Text>Round: {currentRoundIndex + 1}</Text>)}
          <Round
            startWord={currentRound.startWord}
            goalWord={currentRound.goalWord}
            moves={currentRound.moves}
            maxMoves={currentRound.maxMoves}
            wordList={wordList}
            addMove={addMove}
          />
        </>
      )}
      {currentRoundIndex !== null && isRoundOver && (
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
