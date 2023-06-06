const getWordPair = async (roundNumber) => {
  try {
    const response = await fetch('/src/word_pairs.json');
    const data = await response.json();

    // Find the word pair for the current date
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0]; // Format: "yyyy-mm-dd"
    
    if (data[dateString] && data[dateString][roundNumber]) {
      const roundData = data[dateString][roundNumber];
      return [roundData.start_word, roundData.goal_word];
    } else {
      console.error("No data found for the current date and round number");
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getWordPair;
