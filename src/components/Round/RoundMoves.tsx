import { useEffect, useState } from "react";
import { Box, Tag } from "@chakra-ui/react";
import ReactTextTransition, { presets } from "react-text-transition";

type RoundMovesProps = {
  moves: string[];
  start: string;
  goal: string;
  maxMoves: number;
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
    <Tag size="lg" mx="1" my="3" minW="77px" minH="40px" fontSize={fontSize} fontWeight="semibold" colorScheme={colorScheme} justifyContent="center" display="flex" p="0">
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

  const remainingList = moves.length > 1 ? moves.slice(0, -1) : [];

  useEffect(() => {
    let timer: any;
    if (moves.length > 0) {
      const currentWord = moves.slice(-1)[0];
      const priorWord = moves.length > 1 ? moves.slice(-2)[0] : start;
      setNewWord(priorWord);

      timer = setTimeout(() => {
        setNewWord(currentWord);
      }, 500);
    } else {
      setNewWord("");
    }
    return () => { timer && clearTimeout(timer); }
  }, [moves.length, start]);

  return (
    <Box display="flex" flexWrap="wrap"  justifyContent="space-evenly" w="100%" m={-2}>
      <MoveTag word={start} colorScheme="green" />
      {remainingList.map((word, i) => (
        <MoveTag key={`${word}-${i}`} word={word} />
      ))}
      {newWord.length > 0 && (
        <MoveTag word={newWord} />
      )}
      {maxMoves !== Infinity && Array.from({ length: maxMoves - moves.length }, (_, k) => (
        <MoveTag key={k} word="" />
      ))}
      <MoveTag word={goal} colorScheme="blue" />
    </Box>
  );
};

export default RoundMoves;
