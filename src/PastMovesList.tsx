import { useEffect, useState } from "react";
import {
  Text,
  Box,
  Tag
} from "@chakra-ui/react";
import ReactTextTransition, { presets } from "react-text-transition";

type PastMovesListProps = {
  moves: string[];
};

const PastMovesList: React.FC<PastMovesListProps> = ({ moves, start, goal }) => {
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
    }
    return () => { timer && clearTimeout(timer); }
  }, [moves.length, start]);

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
              <ReactTextTransition
                key={index}
                springConfig={presets.stiff}
                translateValue="45%"
                inline
              >
                {letter}
              </ReactTextTransition>
            ))}
          </>
        </MoveTag>
      )}
      <MoveTag>...</MoveTag>
      <MoveTag colorScheme="cyan">
        {goal}
      </MoveTag>
    </Box>
  )
};

const MoveTag: React.FC<{ children: any; colorScheme?: any }> = ({
  children,
  colorScheme,
}) => {
  return (
    <Tag size="lg" m="2" colorScheme={colorScheme}>{children}</Tag>
  );
}

export default PastMovesList;
