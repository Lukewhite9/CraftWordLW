import React, { useState, useEffect, useCallback } from 'react';
import { Text, Button } from '@chakra-ui/react';
import Round from './Round';
import { fetchGameRounds, fetchRandomRound } from '../api/api';

const PRACTICE_MODE_DIFFICULTY = 1;
const GAME_ROUNDS = 5;

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
  const [totalTime, setTotalTime] = useState<number>(0); // New state variable for total time

  // Function to format seconds into minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutes ${remainingSeconds} seconds`;
  }

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

      setRounds(newRounds); // Replace rounds with the new data
      setMaxMoves(parseInt(gameData.rounds[0].pathLength) + 1);
    }
    if (roundIndex === 0) setTotalTime(0); // Set total time to zero at the start of the game
  }, [gameLength]);

  const startGame = useCallback(() => {
    fetchRoundData(0);
    setCurrentRoundIndex(0);
  }, [fetchRoundData]);

  const advanceRound = useCallback(() => {
    const nextRoundIndex = currentRoundIndex !== null ? currentRoundIndex + 1 : 0;
    setCurrentRoundIndex(nextRoundIndex);
  }, [currentRoundIndex]);

  useEffect(() => {
    if (currentRoundIndex === null) {
      startGame();
    } else {
      fetchRoundData(currentRoundIndex);
    }
  }, [currentRoundIndex, startGame, fetchRoundData]);

  const addMove = useCallback((move: string) => {
    if (currentRoundIndex !== null) {
      setRounds((prevRounds) => {
        const updatedRounds = [...prevRounds];
        const newRound = updatedRounds[currentRoundIndex];

        newRound.moves.push(move);
        newRound.completedAt = (move === newRound.goalWord || maxMoves + 1 === newRound.moves.length) ? Date.now() : null;

        // Update total time when a round is completed
        if (newRound.completedAt) {
          const roundDurationSeconds = Math.floor((newRound.completedAt - newRound.startedAt) / 1000);
          setTotalTime((prevTotalTime) => prevTotalTime + roundDurationSeconds);
        }

        updatedRounds[currentRoundIndex] = newRound;
        return updatedRounds;
      });
    }
  }, [setRounds, currentRoundIndex, maxMoves]);

  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  const isRoundWon = isRoundOver && (currentRound.moves.includes(currentRound.goalWord) || gameLength === null);

  const roundDuration = isRoundOver ? Math.floor((currentRound.completedAt - currentRound.startedAt) / 1000) : null;
  const formattedRoundDuration = formatTime(roundDuration || 0);
  const formattedTotalTime = formatTime(totalTime);

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
          {isRoundWon ? <Text>Nicely done! You finished in {formattedRoundDuration}.</Text> : <Text>Welp, no more moves left. Better luck next round!</Text>}
          {currentRoundIndex === GAME_ROUNDS - 1 && <Text>Total time for all rounds: {formattedTotalTime}.</Text>}
          <Button onClick={advanceRound}>Onwards!</Button>
        </>
      )}
    </div>
  );
};

export default Game;
