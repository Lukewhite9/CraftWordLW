import React, { useEffect, useState } from "react";
import { Box, Tag } from "@chakra-ui/react";
import ReactTextTransition, { presets } from "react-text-transition";
import MovingText from 'react-moving-text';

type RoundMovesProps = {
  moves: string[];
  start: string;
  goal: string;
  maxMoves: number | null;
};


const FONT_SIZES_TO_MAX_LETTERS = { 
  19: 5, 
  17: 6,
  15: 7,
  13: 8, 
  10: Infinity, 
};

function calculateFontSize(word: string) {
  const letters = word.length;
  for (const [fontSize, maxLetters] of Object.entries(FONT_SIZES_TO_MAX_LETTERS).map(([key, val]) => [parseInt(key, 10), val]).sort(([keyA], [keyB]) => keyB - keyA)) {
    if (letters <= maxLetters) {
      return fontSize;
    }
  }
  return 10; 
}



const MoveTag: React.FC<{ word: string; colorScheme?: any }> = ({ word, colorScheme }) => {
  const fontSize = calculateFontSize(word) + "px";

  return (
    <Tag size="lg" mx="1" my="3" minW="82px" minH="40px" fontSize={fontSize} fontWeight="semibold" colorScheme={colorScheme} justifyContent="center" display="flex" p="0">
  <div style={{ textAlign: 'center' }}>
    {word.split("").map((letter, index) => (
      <ReactTextTransition
        key={index}
        springConfig={presets.stiff}
        translateValue="45%"
        inline
      >
        {letter}
      </ReactTextTransition>
    ))}
  </div>
</Tag>

  );
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
    <Box display="flex" flexWrap="wrap"  w="100%" m={-4}>
      <MoveTag word={start} colorScheme="green" />
      {remainingList.map((word, i) => (
        <MoveTag key={`${word}-${i}`} word={word} />
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
        <MoveTag word={newWord} />

      )}

      {maxMoves !== Infinity ? 
    Array.from({ length: maxMoves - moves.length }, (_, k) => <MoveTag key={k} word="" />)
: 
    (maxMoves !== null && Array.from({ length: maxMoves - moves.length }, (_, k) => <MoveTag key={k} />))
}
<MoveTag word={goal} colorScheme="blue" />

    </Box>
  );
};

export default RoundMoves;
