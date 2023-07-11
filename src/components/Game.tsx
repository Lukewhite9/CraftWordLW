import React, { useState, useEffect, useCallback } from 'react';
import { Flex, Text, Button } from '@chakra-ui/react';
import Round from './Round';
import { fetchWordPair } from '../api/api';

type GameProps = {
  wordList: string[];
};

export type Round = {
  startWord: string;
  goalWord: string;
  maxMoves: number;
  moves: string[];
  startedAt: any;
  completedAt: any;
};

export type Score = {
  name: string;
  score: number;
  time: number;
};


const Game: React.FC<GameProps> = ({ wordList }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number | null>(null);

  const advanceRound = useCallback(() => {
    const nextRoundIndex = currentRoundIndex !== null ? currentRoundIndex + 1 : 0;
    setCurrentRoundIndex(nextRoundIndex);
  }, [currentRoundIndex, setCurrentRoundIndex]);

  const startGame = useCallback(async () => {
    const roundsData = await fetchWordPair();
    if (!roundsData) {
      console.log("Error fetching game");
      return;
    }

    setRounds(
      roundsData.rounds.map((round: any) => ({
        ...round,
        maxMoves: round.pathLength + 1,
        moves: [],
        startedAt: null,
        completedAt: null,
      })));
    advanceRound();
  }, [advanceRound, setRounds]);

  useEffect(() => {
    if (currentRoundIndex === null) {
      startGame();
    }
  }, [currentRoundIndex]);

  const addMove = useCallback((move: string) => {
    if (currentRoundIndex !== null) {
      setRounds((prevRounds) => {
        const updatedRounds = [...prevRounds];
        const newRound = updatedRounds[currentRoundIndex];

        newRound.moves.push(move);
        newRound.completedAt = move === newRound.goalWord || newRound.maxMoves + 1 === newRound.moves.length;

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
          {currentRoundIndex && (<Text>Round: {currentRoundIndex + 1}</Text>)}
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
      {isRoundOver && (
        <>
          {isRoundWon ? <Text>Nicely done! You finished in {currentRound.moves.length} moves.</Text> : <Text>Welp, no more moves left. Better luck next round!</Text>}
          <Button onClick={advanceRound}>Onwards!</Button>
        </>
      )}
    </div>
  );
};

export default Game;
