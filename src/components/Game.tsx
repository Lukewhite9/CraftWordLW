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
  const [showEndOfRoundMessage, setShowEndOfRoundMessage] = useState(false);
  const [showWinningMessage, setShowWinningMessage] = useState(false);

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
    setShowEndOfRoundMessage(false); // Reset the flag to hide the end of round message
    setShowWinningMessage(false); // Reset the flag to hide the winning message
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
        newRound.completedAt = move === newRound.goalWord || maxMoves + 1 === newRound.moves.length;

        updatedRounds[currentRoundIndex] = newRound;
        return updatedRounds;
      });
    }
  }, [setRounds, currentRoundIndex, maxMoves]);

  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  const isRoundWon = isRoundOver && (currentRound.moves.includes(currentRound.goalWord) || gameLength === null);

  useEffect(() => {
    let timer: any;
    if (isRoundOver && isRoundWon) {
      timer = setTimeout(() => {
        setShowWinningMessage(true); // Show the winning message after 1.5 seconds
      }, 1500);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [isRoundOver, isRoundWon]);

  useEffect(() => {
    let timer: any;
    if (isRoundOver && !isRoundWon) {
      timer = setTimeout(() => {
        setShowEndOfRoundMessage(true); // Show the end of round message after 1.5 seconds
      }, 1500);
    }
    return () => {
      timer && clearTimeout(timer);
    };
  }, [isRoundOver, isRoundWon]);

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
          {isRoundWon && showWinningMessage ? (
            <Text>Nicely done! You finished in {currentRound.moves.length} moves.</Text>
          ) : !isRoundWon && showEndOfRoundMessage ? (
            <Text>Welp, no more moves left. Better luck next round!</Text>
          ) : null}
          <Button onClick={advanceRound}>Onwards!</Button>
        </>
      )}
    </div>
  );
};

export default Game;
