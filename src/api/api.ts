const BASE_URL = 'https://back-end-20.lukewhite9.repl.co';

// TODO: Fix typing
export const fetchDefinition = async (word: string): Promise<any> => {
  return fetch(`${BASE_URL}/definition/${word}`).then(data => data.json());
}

export const fetchWordPair = async (): Promise<any | {}> => {
  try {
    const date = new Date();
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    const response = await fetch(`${BASE_URL}/wordpairs?date=${dateKey}`);

    if (!response.ok) {
      console.error('Failed to fetch new word pair');
      return {};
    }

    const data = await response.json();
    const gameData = data.rounds.map((round) => ({
      startWord: round.start_word,
      goalWord: round.goal_word,
      pathLength: round.path_length,
    }));

    return {
      gameID: data.gameID,
      rounds: gameData
    };
  } catch (error) {
    console.error('Error fetching new word pair:', error);
    return {};
  }
};

// TODO: Retrieve high score
export const fetchScores = async () => {
  return [];
}

// TODO: Retrieve high score
export const retrieveHighScore = async () => {
  return "dummy retrieve high score"
}

// TODO: Save high score
export const saveHighScore = async () => {
  return "dummy save high score"
}
