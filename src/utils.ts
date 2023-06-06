import wordPairs from './word_pairs.json';

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

export const getWordPairs = async () => {
  const response = await fetch('src/word_pairs.json');
  const data = await response.json();
  return data;
};

export const getNewWordPair = async (roundNumber: number): Promise<[string, string]> => {
  const date = new Date();
  const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  console.log("Date Key:", dateKey);
  const dayConfig = wordPairs[dateKey];
  console.log("Day Config:", dayConfig);
  const roundConfig = dayConfig ? dayConfig[`${roundNumber}`] : null;
  console.log("Round Config:", roundConfig);

  if (roundConfig) {
    return [roundConfig.start_word, roundConfig.goal_word];
  } else {
    console.error("No data found for the current date and round number");
    return [];
  }
};


// Get the appropriate file based on round number
const getFileName = (roundNumber) => {
  // Calculate difficulty based on round number
  const difficulty = Math.min(Math.floor((roundNumber + 1) / 2), 17);
  return `${difficulty}_steps.txt`;
}

export const getRandomWordPair = async (roundNumber) => {
  const fileName = getFileName(roundNumber);
  // Load the word pair file
  const response = await fetch(`/${fileName}`);
  const text = await response.text();

  // Split the text into lines and select a random line
  const lines = text.split('\n');
  const randomLine = lines[Math.floor(Math.random() * lines.length)];

  // Split the line into words and return as a pair
  return randomLine.split(',');
}