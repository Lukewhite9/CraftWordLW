import React from "react";
import ReactTextTransition, { presets } from "react-text-transition";

interface CurrentWordProps {
  currentWord: string;
}

const CurrentWord: React.FC<CurrentWordProps> = ({ currentWord }) => {
  const splitWord = currentWord ? currentWord.split('') : [];

  return (
    <div>
      {splitWord.map((letter, index) => (
        <ReactTextTransition
          key={index}
          springConfig={presets.stiff}
           translateValue="45%"
          inline
        >{letter}</ReactTextTransition>
      ))}
    </div>
  );
};

export default CurrentWord;