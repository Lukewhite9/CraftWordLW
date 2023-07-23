import React, { useState, useEffect, useCallback } from 'react';
import { Input, Text, Button, Box, Flex } from '@chakra-ui/react';
import Round from './Round';
import { fetchGameRounds, fetchRandomRound } from '../api/api';
import { saveScores, CHALLENGE_VERSION } from '../api/api';

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
  roundScore: number;
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
  const [totalGameTime, setTotalGameTime] = useState<number>(0);
  const [totalMoves, setTotalMoves] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  
  const fetchRoundData = useCallback(async (roundIndex: number) => {
    if (gameLength === null) {
  const roundData = await fetchRandomRound(roundIndex + 1, PRACTICE_MODE_DIFFICULTY);
  if (roundData) {
    const newRound = {
      ...roundData,
      moves: [],
      startedAt: Date.now(),
      completedAt: null,
      maxMoves: Infinity,
      roundScore: Infinity,
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
    roundScore: parseInt(roundData.pathLength) + 2,
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
      roundScore: parseInt(nextRound.pathLength) + 1,
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
      newRound.roundScore = newRound.roundScore - 1; 
      newRound.moves.push(move); 
      if (move === newRound.goalWord || newRound.maxMoves + 1 === newRound.moves.length) {
        newRound.completedAt = Date.now();
        setTotalGameTime(prevTime => prevTime + (newRound.completedAt - newRound.startedAt) / 1000);
        setTotalScore(prevTotalScore => prevTotalScore + newRound.roundScore); 
      }
      updatedRounds[currentRoundIndex] = newRound;
      return updatedRounds;
    });
    setTotalMoves((prevTotalMoves) => prevTotalMoves + 1); 
  }
}, [setRounds, currentRoundIndex, maxMoves]);

  useEffect(() => {
  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  if (currentRoundIndex === 4 && isRoundOver && playerName.trim() === '' && totalScore > 0) {
    // This function is run when the round is over
    const savePlayerScore = async () => {
      // Use the current date to create a dateKey
      const date = new Date();
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      // Save the score with name 'null'
      await saveScores('thenamelessplayer', totalScore, totalGameTime, dateKey, CHALLENGE_VERSION);
    };
    savePlayerScore();
  }
}, [playerName, totalScore, totalGameTime, currentRoundIndex, rounds]);


  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  const isRoundWon = isRoundOver && currentRound.moves.includes(currentRound.goalWord);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  return (
    <div>
      {currentRound && !isRoundOver && (
        <>
          {currentRoundIndex !== null && (
            <Flex justify="space-between" mb="5">
              <Text>Round: {currentRoundIndex + 1}</Text>
              <Text>Score: {currentRound.roundScore}</Text>
            </Flex>
          )}
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
            <Box>
              <Text textAlign="center" my="5" fontWeight="bold">
                Nicely done!
              </Text>
              <Text my="2">
                You finished in {currentRound.moves.length} moves. Your score for this round is {currentRound.roundScore}.
              </Text>
              <Text my="2">
                Your time to complete round {currentRoundIndex + 1} was{' '}
                {formatTime((currentRound.completedAt - currentRound.startedAt) / 1000)}.
              </Text>
              {currentRoundIndex < 4 && (
                <Flex justify="center">
                  <Button  mt="4" colorScheme="teal" onClick={advanceRound}>
                  Start Next Round
                </Button>
                  </Flex>
              )}
            </Box>
          ) : (
            <Box>
              <Text textAlign="center" my="5" fontWeight="bold">
                Round Over
              </Text>
              <Text my="2">
                You didn't reach the goal word in time. Your score for this round is {currentRound.roundScore}.
              </Text>
              {currentRoundIndex < 4 && (
                <Flex justify="center">
                  <Button  mt="4" colorScheme="teal" onClick={advanceRound}>
                  Start Next Round
                </Button>
                  </Flex>
              )}
            </Box>
          )}
        </>
      )}
      {currentRoundIndex === 4 && isRoundOver && (
    <>
      <Text mt="5">Your total moves for all rounds was {totalMoves}.</Text>
    <Text my="2">Your total time for all rounds was {formatTime(totalGameTime)}.</Text>
    <Text mb="5">Your total score for all rounds is {totalScore}.</Text>

    {!showInput && (
            <Box mt="5">
        <Text my="5">Please enter your name to record your score:</Text>
        <Flex direction="column" alignItems="center"> 
          <Input maxWidth="300px" placeholder="Your Name" textAlign="center" mb="2" onChange={(e) => setPlayerName(e.target.value)} />
          <Button width="240px" mt="2" colorScheme="teal" onClick={async () => {
            if (playerName.trim() !== '') {
              const date = new Date();
              const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
              await saveScores(playerName, totalScore, totalGameTime, dateKey, CHALLENGE_VERSION);
              setPlayerName('');
            }
          }}>Submit Score</Button>
        </Flex>
      </Box>
      
        )}
    </>
      )}
    </div>
  );
};

export default Game;
