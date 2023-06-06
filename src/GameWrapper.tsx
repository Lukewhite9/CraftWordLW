import { useState, useEffect, useCallback } from "react";
import { Heading, Flex, useDisclosure } from "@chakra-ui/react";
import { getNewWordPair } from "./utils";
import Game from "./Game";
import GameOverModal from "./GameOverModal";
import RoundOverModal from "./RoundModal";

export type Round = {
  startWord: string;
  goalWord: string;
  moves: string[];
}

type GameWrapperProps = {
  wordList: string[];
};

const GameWrapper: React.FC<GameWrapperProps> = ({ wordList }) => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [roundOver, setRoundOver] = useState(false);
  const {
    isOpen: endModalOpen,
    onOpen: onEndModalOpen,
    onClose: onEndModalClose,
  } = useDisclosure();
  const {
    isOpen: roundModalOpen,
    onOpen: onRoundModalOpen,
    onClose: onRoundModalClose,
  } = useDisclosure();

  // the current round, or null if no rounds exist
  const currentRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;

  // number of rounds in a game
  const gameLength = 5;

  // initializes a new round
  const addRound = useCallback((startWord: string, goalWord: string) => {
    const newRound = { startWord, goalWord, moves: [] };
    setRounds([...rounds, newRound]);
  }, [rounds, setRounds]);

  // if no rounds yet, creates the first round
  useEffect(() => {
    addRound(getNewWordPair(1)[0], getNewWordPair(1)[1]);
  }, []);

  const updateCurrentRound = useCallback((updateRound: Round) => {
    if (!currentRound) return;

    const updatedRound = {
      ...currentRound,
      ...updateRound,
    };
    const roundsCopy = [...rounds];
    roundsCopy.pop();
    roundsCopy.push(updatedRound);
    setRounds(roundsCopy);

    const { goalWord, moves } = updatedRound;
    if (moves[moves.length - 1] === goalWord) {
      setRoundOver(true);
    }
  }, [currentRound, rounds, setRounds]);

  useEffect(() => {
    if (roundOver) {
      if (rounds.length < gameLength) {
        const roundNumber = rounds.length + 1;
        addRound(
          getNewWordPair(roundNumber)[0],
          getNewWordPair(roundNumber)[1]
        );
        setRoundOver(false);
        onRoundModalOpen();
      } else if (rounds.length === gameLength) {
        onEndModalOpen();
      }
    }
  }, [roundOver, addRound, setRoundOver, onEndModalOpen, onRoundModalOpen]);

  return (
    <div>
      <Flex justifyContent="center">
        <Heading size="lg">Round {rounds.length}</Heading>
      </Flex>
      {currentRound && (
        <Game
          currentRound={currentRound}
          wordList={wordList}
          updateCurrentRound={updateCurrentRound}
        />
      )}
      <GameOverModal
        isOpen={endModalOpen}
        onClose={onEndModalClose}
      />
      <RoundOverModal
        isOpen={roundModalOpen}
        onClose={onRoundModalClose}
      />
    </div>
  );
};

export default GameWrapper;
