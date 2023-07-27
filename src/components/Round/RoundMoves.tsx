import React, { useEffect, useState } from "react";
import { Box, Tag } from "@chakra-ui/react";
import ReactTextTransition, { presets } from "react-text-transition";
import MovingText from 'react-moving-text';

type RoundMovesProps = {
  moves: string[];
  start: string;
  goal: string;
  maxMoves: number;
};

const RoundMoves: React.FC<RoundMovesProps> = ({ moves, start, goal, maxMoves }) => {
  const [newWord, setNewWord] = useState("");
  const [isWinningMove, setIsWinningMove] = useState(false);
  const [startSecondAnimation, setStartSecondAnimation] = useState(false);

  const remainingList = moves.length > 1 ? moves.slice(0, -1) : [];

  useEffect(() => {
    let timer: any;
    if (moves.length > 0) {
      const currentWord = moves.slice(-1)[0];
      const priorWord = moves.length > 1 ? moves.slice(-2)[0] : start;
      setNewWord(priorWord);
      setStartSecondAnimation(false);

      timer = setTimeout(() => {
        setNewWord(currentWord);
        if (currentWord === goal) {
          setIsWinningMove(true);
        }
      }, 500);

      const timer2 = setTimeout(() => {
        setStartSecondAnimation(true);
      }, 1000);

      return () => { clearTimeout(timer); clearTimeout(timer2); }
    } else {
      setNewWord("");
    }
  }, [moves.length, start, goal]);

  const onAnimationEnd = () => {
    setIsWinningMove(false);
  };

  return (
    <Box w="100%" m={-2}>
      <MoveTag colorScheme="cyan">
        {start}
      </MoveTag>
      {remainingList.map((word, i) => (
        <MoveTag key={`${word}-${i}`}>
          {word}
        </MoveTag>
      ))}
      {newWord.length > 0 && (
        <MoveTag>
          <>
            {newWord.split("").map((letter, index) => (
              <React.Fragment key={index}>
                {isWinningMove && startSecondAnimation ? (
                  <MovingText
                    onAnimationEnd={index === newWord.length - 1 ? onAnimationEnd : undefined}
                    type="bounce"
                    duration="1000ms"
                    delay={`${index * 20}ms`}
                    direction="alternate"
                    timing="ease"
                    iteration="1"
                    fillMode="none"
                  >
                    {letter}
                  </MovingText>
                ) : (
                  <ReactTextTransition
                    springConfig={presets.stiff}
                    translateValue="45%"
                    inline
                  >
                    {letter}
                  </ReactTextTransition>
                )}
              </React.Fragment>
            ))}
          </>
        </MoveTag>
      )}
      {maxMoves !== Infinity && Array.from({ length: maxMoves - moves.length }, (_, k) => (
        <MoveTag key={k} />
      ))}
      <MoveTag colorScheme="cyan">
        {goal}
      </MoveTag>
    </Box>
  )
};

const MoveTag: React.FC<{ children?: any; colorScheme?: any }> = ({
  children,
  colorScheme,
}) => {
  return (
    <Tag size="lg" m="2" minW="60px" colorScheme={colorScheme}>{children}</Tag>
  );
}

export default RoundMoves;
