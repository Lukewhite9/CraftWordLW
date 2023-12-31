import React, { useState, useEffect, useCallback } from 'react';
import { Input, Text, Button, Box, Flex } from '@chakra-ui/react';
import Round from './Round';
import { fetchGameRounds, fetchRandomRound } from '../api/api';
import { calculateTotalTime, formatTime } from '../utils/utils';
import { saveScores, CHALLENGE_VERSION } from '../api/api';
import { useDisclosure } from '@chakra-ui/react';
import LeaderboardModal from './LeaderboardModal';
import GameCountdown from './GameCountdown';



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
  const [totalGameTime, setTotalGameTime] = useState<number>(0);
  const [totalMoves, setTotalMoves] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const isPracticeMode = gameLength === null;
  const [isScoreSubmitted, setIsScoreSubmitted] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();


  const fetchGameData = useCallback(async () => {
    const gameData = await fetchGameRounds();
    const newRounds = gameData.rounds.map((roundData: any) => ({
      ...roundData,
      maxMoves: parseInt(roundData.pathLength) + 1,
      roundScore: parseInt(roundData.pathLength) + 1,
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

    if (gameLength === null) {
        addNewRandomRound(nextRoundIndex);
    } else {
        setCurrentRoundIndex(nextRoundIndex);
        fetchGameData(nextRoundIndex); 
        setRounds(prevRounds => prevRounds.map((round, index) => {
            if (index === nextRoundIndex) {
                return { ...round, startedAt: Date.now() };
            } else {
                return round;
            }
        }));
    }
}, [currentRoundIndex, fetchGameData, gameLength, addNewRandomRound]);

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
}, [setRounds, currentRoundIndex]);

  useEffect(() => {
  const currentRound = currentRoundIndex !== null ? rounds[currentRoundIndex] : null;
  const isRoundOver = currentRound && !!currentRound.completedAt;
  if (currentRoundIndex === 4 && isRoundOver && playerName.trim() === '' && totalScore > 0) {
    
    const savePlayerScore = async () => {
      
      const date = new Date();
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      await saveScores('thenamelessplayer', totalScore, totalGameTime, dateKey, CHALLENGE_VERSION);
    };
    savePlayerScore();
  }
}, [playerName, totalScore, totalGameTime, currentRoundIndex, rounds]);



  const currentRound = rounds[currentRoundIndex];
  const isRoundOver = currentRound && !!currentRound.completedAt;
  const isRoundWon = isRoundOver && currentRound.moves.includes(currentRound.goalWord);



  return (
    <div>
      {currentRound && !isRoundOver && (
        <>
          {currentRoundIndex !== null && (
            <Flex justify="space-between" mb="5">
            <Text>Round: {currentRoundIndex + 1}</Text>
            {gameLength !== null && <Text>Score: {currentRound.roundScore}</Text>}
          </Flex>
          )}
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
          {isRoundWon ? (

            <Box>
                <Text textAlign="center" my="5" fontWeight="bold">
                  Nicely done!
                </Text>
                <Text my="2">
                  You finished in {currentRound.moves.length} moves.
                </Text>
                {gameLength !== null && (
                  <Text>Your score for round {currentRoundIndex + 1} is {currentRound.roundScore}.</Text>
                )}
                <Text my="2">
                  Your time to complete round {currentRoundIndex + 1} was{' '}
                  {formatTime((currentRound.completedAt - currentRound.startedAt) / 1000)}.
                </Text>
                {(gameLength === null || currentRoundIndex < 4) && (
                  <Flex justify="center">
                    <Button mt="4" colorScheme="teal" onClick={advanceRound}>
                      Onwards!
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
              {(gameLength === null || currentRoundIndex < 4) && (
                <Flex justify="center">
                  <Button  mt="4" colorScheme="teal" onClick={advanceRound}>
                  Onwards!
                </Button>
                  </Flex>
              )}
            </Box>
          )}
        </>
      )}
      {gameLength !== null && currentRoundIndex === 4 && isRoundOver && (
    <>
      
        <Text mt="5">Your total moves for all rounds was {totalMoves}.</Text>
    <Text my="2">Your total time for all rounds was {formatTime(totalGameTime)}.</Text>
    <Text mb="5">Your total score for all rounds is {totalScore}.</Text>
        
      

    {!isScoreSubmitted && (
            <Box mt="5">
        <Text my="5">Please enter your name to record your score:</Text>
        <Flex direction="column" alignItems="center"> 
          <Input maxWidth="300px" placeholder="Your Name" textAlign="center" mb="2" onChange={(e) => setPlayerName(e.target.value)} />
          <Button width="240px" mt="2" colorScheme="teal" onClick={async () => {
            if (playerName.trim() !== '') {
              const date = new Date();
              const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
              await saveScores(playerName, totalScore, totalGameTime, dateKey, CHALLENGE_VERSION);
              setIsScoreSubmitted(true);
              setPlayerName('');
              onOpen();
            }
          }}>Submit Score</Button>
          
        </Flex>
              
      </Box>
      
      
        )}
      <GameCountdown />
    </>
      )}
      
      <LeaderboardModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Game;
