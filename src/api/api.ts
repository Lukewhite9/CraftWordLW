const BASE_URL = 'https://back-end-20.lukewhite9.repl.co';

// TODO: Fix typing
export const fetchDefinition = async (word: string): Promise<any> => {
  return fetch(`${BASE_URL}/definition/${word}`).then(data => data.json());
}

export const fetchWordPair = async (roundNumber: number): Promise<any | {}> => {
  const version = 1; // Define the version number

  try {
    const date = new Date();
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    const response = await fetch(`${BASE_URL}` + `/wordpairs?version=${version}&date=${dateKey}&round=${roundNumber}`);

    if (!response.ok) {
      console.error('Failed to fetch new word pair');
      return {};
    }

    const data = await response.json();
    return {
      startWord: data.start_word,
      goalWord: data.goal_word,
      pathLength: data.path_length,
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
