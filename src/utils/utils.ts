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
    // Check for anagrams
    const sorted_word1 = word1.toLowerCase().split('').sort().join('');
    const sorted_word2 = word2.toLowerCase().split('').sort().join('');
    if (sorted_word1 === sorted_word2) {
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
}

export const isValidWord = (word: string, wordList: string[]) => {
  return wordList.includes(word.toLowerCase());
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

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' + seconds :     seconds}`;
};