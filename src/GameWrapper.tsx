import React, { useState, useEffect, useCallback } from 'react';
import { Heading, Flex, Text } from '@chakra-ui/react';
import { getNewWordPair, getRandomWordPair } from './utils';
import Game from './Game';

type GameWrapperProps = {
  wordList: string[];
  gameLength: number | null;
};

type GameWrapperProps = {
  wordList: string[];
  isPracticeMode: boolean;
};

type Round = {
  startWord: string;
  goalWord: string;
  moves: string[];
};

const GameWrapper: React.FC<GameWrapperProps> = ({ wordList, gameLength }) => {
  const [rounds, setRounds] = useState<Round[]>([]);

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
      fetchNewWordPair(1).then((pair) => addRound(pair));

    }
  }, [rounds.length, fetchNewWordPair]);

  const addRound = useCallback((wordPair: string[]) => {
    const newRound: Round = {
      startWord: wordPair[0],
      goalWord: wordPair[1],
      moves: [],
    };
    setRounds([...rounds, newRound]);
  }, [rounds, setRounds]);

  const updateCurrentRound = useCallback((updateRound: Round) => {
    setRounds((prevRounds) => {
      const updatedRounds = [...prevRounds];
      updatedRounds[updatedRounds.length - 1] = updateRound;
      return updatedRounds;
    });
  }, [setRounds]);

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
        <Heading size="lg">Round {rounds.length}</Heading>
        <Text ml="3">Current Score: {currentRound?.moves.length || 0}</Text>
      </Flex>
      {currentRound && (
        <Game
          currentRound={currentRound}
          updateCurrentRound={updateCurrentRound}
          wordList={wordList}
          rounds={rounds}
          isRoundOver={!!isRoundOver}
          isGameOver={!!isGameOver}
          onContinue={() => {
            fetchNewWordPair(rounds.length + 1).then((pair) => { addRound(pair) })
          }}
        />
      )}
    </div>
  );
};

export default GameWrapper;
