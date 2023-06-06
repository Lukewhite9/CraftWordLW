import { useState, useEffect } from 'react';
import fs from 'fs';

// Utility function to generate a random integer within a range
function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getWordPair = async (roundNumber: number, practiceMode: boolean): Promise<string[]> => {
  const filePath = 'word_pair_calendar.txt'; // Replace with the actual file path

  try {
    const text = fs.readFileSync(filePath, 'utf-8');

    // Find the word pair for the current date
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0]; // Format: "yyyy-mm-dd"
    const regex = new RegExp(`Date: ${dateString}(.+?)Date:`, 's');
    const match = text.match(regex);
    const wordPairs = match ? match[1].trim().split('\n') : [];

    // Extract the word pair for the given round number
    const roundIndex = Math.min(roundNumber - 1, wordPairs.length - 1);
    const roundWords = wordPairs[roundIndex]?.trim().split(':').map(word => word.trim()) ?? [];

  return roundWords;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getWordPair;
