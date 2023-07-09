import { fetchWordPair } from '../api/api';

const version = 1; // Set the desired version number
const pairData = await fetchWordPair(version);

export const isValidTransformation = (word1: string, word2: string) => {
  const len_diff = word1.length - word2.length;

  if (Math.abs(len_diff) === 1) {
    if (len_diff === 1) {
      // Remove a letter
      for (let i = 0; i < word1.length; i++) {
        const modified_word = word1.slice(0, i) + word1.slice(i + 1);
        if (modified_word.toLowerCase() === word2.toLowerCase()) {
          return true;
        }
      }
    } else {
      // Add a letter
      for (let i = 0; i <= word1.length; i++) {
        for (let letter of 'abcdefghijklmnopqrstuvwxyz') {
          const new_word = word1.slice(0, i) + letter + word1.slice(i);
          if (new_word.toLowerCase() === word2.toLowerCase()) {
            return true;
          }
        }
      }
    }
  } else if (len_diff === 0) {
    // Swap any two adjacent letters
    for (let i = 0; i < word1.length - 1; i++) {
      const new_word =
        word1.slice(0, i) +
        word1[i + 1] +
        word1[i] +
        word1.slice(i + 2);
      if (new_word.toLowerCase() === word2.toLowerCase()) {
        return true;
      }
    }

    // Swap the last letter to the front
    const new_word_last_to_front =
      word1.slice(-1) + word1.slice(0, -1);
    if (new_word_last_to_front.toLowerCase() === word2.toLowerCase()) {
      return true;
    }

    // Swap the first letter to the end
    const new_word_first_to_end =
      word1.slice(1) + word1.slice(0, 1);
    if (new_word_first_to_end.toLowerCase() === word2.toLowerCase()) {
      return true;
    }

    // Change a single letter
    for (let i = 0; i < word1.length; i++) {
      for (let letter of 'abcdefghijklmnopqrstuvwxyz') {
        if (word1[i].toLowerCase() !== letter.toLowerCase()) {
          const new_word = word1.slice(0, i) + letter + word1.slice(i + 1);
          if (new_word.toLowerCase() === word2.toLowerCase()) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

export const isValidWord = (word: string, wordList: string[]) => {
  return wordList.includes(word.toLowerCase());
};

export const getNewWordPairAPI = async (rounds: number = 5): Promise<{ startWord: string, goalWord: string, pathLength: number }[] | null> => {
  try {
    const pairData = await fetchWordPair(version);
    
    if (pairData.rounds.length < rounds) {
      console.error('Insufficient word pairs available');
      return null;
    }

    const gameID = pairData.gameID;
    const pairsData = pairData.rounds.slice(0, rounds);

    return pairsData.map((round) => ({
      startWord: round.startWord,
      goalWord: round.goalWord,
      pathLength: round.pathLength,
    }));
  } catch (error) {
    console.error('Error fetching new word pairs:', error);
    return null;
  }
};

export const getRandomWordPair = async (roundNumber: number) => {
  const fileName = getFileName(roundNumber);
  // Load the word pair file
  const response = await fetch(`/${fileName}`);
  const text = await response.text();

  // Split the text into lines and select a random line
  const lines = text.split('\n');
  const randomLine = lines[Math.floor(Math.random() * lines.length)];

  // Split the line into words and return as a pair
  const words = randomLine.split(',');
  return {
    startWord: words[0],
    goalWord: words[1],
    pathLength: 20,
  };
};

// Get the appropriate file based on round number
const getFileName = (roundNumber: number) => {
  // Calculate difficulty based on round number
  const difficulty = Math.min(Math.floor((roundNumber + 1) / 2), 25);
  return `${difficulty}_steps.txt`;
};

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();
