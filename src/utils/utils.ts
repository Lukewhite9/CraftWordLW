export const isValidTransformation = (word1: string, word2: string) => {
  
  return true;
}

export const isValidWord = (word: string, wordList: string[]) => {
  return true;
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
