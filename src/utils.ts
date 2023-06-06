import { demoWordPairs } from './pairsDemo';

export const isValidTransformation = (word1: string, word2: string) => {
  let len_diff = word1.length - word2.length;

  if (Math.abs(len_diff) === 1) {
    if (len_diff === 1) {
      // Remove a letter
      for (let i = 0; i < word1.length; i++) {
        let modified_word = word1.slice(0, i) + word1.slice(i + 1);
        if (modified_word.toLowerCase() === word2.toLowerCase()) {
          return true;
        }
      }
    } else {
      // Add a letter
      for (let i = 0; i <= word1.length; i++) {
        for (let letter of 'abcdefghijklmnopqrstuvwxyz') {
          let new_word = word1.slice(0, i) + letter + word1.slice(i);
          if (new_word.toLowerCase() === word2.toLowerCase()) {
            return true;
          }
        }
      }
    }
  } else if (len_diff === 0) {
    // Swap adjacent letters
    for (let i = 0; i < word1.length - 1; i++) {
      let new_word = word1.slice(0, i) + word1[i + 1] + word1[i] + word1.slice(i + 2);
      if (new_word.toLowerCase() === word2.toLowerCase()) {
        return true;
      }
    }
    // Substitute a letter
    for (let i = 0; i < word1.length; i++) {
      for (let letter of 'abcdefghijklmnopqrstuvwxyz') {
        let new_word = word1.slice(0, i) + letter + word1.slice(i + 1);
        if (new_word.toLowerCase() === word2.toLowerCase()) {
          return true;
        }
      }
    }
  }
  return false;
}

export const isValidWord = (word: string, wordList: string[]) => {
  return wordList.includes(word.toLowerCase());
}

export const getNewWordPair = (roundNumber: number) => {
  const dateKey = "2023-6-1";
  console.log(dateKey);
  const dayConfig = demoWordPairs[dateKey];
  const roundConfig = dayConfig[`Round ${roundNumber}`];
  return [roundConfig[0], roundConfig[1].split(":")[0]];
}