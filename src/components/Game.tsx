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
  const [showResult, setShowResult] = useState<boolean>(false);

  const fetchRoundData = useCallback(async (roundIndex: number) => {
    if (gameLength === null) {
      const roundData = await fetchRandomRound(roundIndex + 1, PRACTICE_MODE_DIFFICULTY);
      if (roundData) {
        const newRound = {
          ...roundData,
          moves: [],
          startedAt: null,
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
        startedAt: null,
        completedAt: null,
      }));

      setRounds(newRounds); // Replace rounds with the new data
      setMaxMoves(parseInt(gameData.rounds[0].pathLength) + 1);
    }
  }, [gameLength]);


  const startGame = useCallback(() => {
    fetchRoundData(0);
    setCurrentRoundIndex(0);
  }, [fetchRoundData]);

  const advanceRound = useCallback(() => {
    const nextRoundIndex = currentRoundIndex !== null ? currentRoundIndex + 1 : 0;
    setCurrentRoundIndex(nextRoundIndex);
    setShowResult(false);
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
      const roundCompleted = move === newRound.goalWord || maxMoves + 1 === newRound.moves.length;
      newRound.completedAt = roundCompleted ? new Date() : null;

      updatedRounds[currentRoundIndex] = newRound;
      
      if (roundCompleted) {
        setTimeout(() => {
          setShowResult(true);
        }, 2000);
      }
      
      return updatedRounds;
    });
  }
}, [setRounds, currentRoundIndex, maxMoves]);



  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  const isRoundWon = isRoundOver && (currentRound?.moves.includes(currentRound?.goalWord) || gameLength === null);

  return (
  <div>
    {currentRound && (!showResult) && (
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
    {showResult && (
      <>
        {isRoundWon ? <Text>Nicely done! You finished in {currentRound?.moves.length} moves.</Text> : <Text>Welp, no more moves left. Better luck next round!</Text>}
        <Button onClick={advanceRound}>Onwards!</Button>
      </>
    )}
  </div>
);

};

export default Game;