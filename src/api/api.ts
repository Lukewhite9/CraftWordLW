const BASE_URL = 'https://back-end-20.lukewhite9.repl.co';
const CHALLENGE_VERSION = 1;

// TODO: Fix typing
export const fetchDefinition = async (word: string): Promise<any> => {
  return fetch(`${BASE_URL}/definition/${word}`).then(data => data.json());
}

export const fetchGameRounds = async (): Promise<any | {}> => {
  try {
    const date = new Date();
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    const response = await fetch(`${BASE_URL}/wordpairs?date=${dateKey}&version=${CHALLENGE_VERSION}`);

    if (!response.ok) {
      console.error('Failed to fetch new word pair');
      return {};
    }

    const data = await response.json();
    console.log('Received game:', data);

    const gameData = data.rounds.map((
      round: {
        start_word: string;
        goal_word: string;
        path_length: string;
      }
    ) => ({
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

export const fetchRandomRound = async (roundNumber: number, difficulty: number): Promise<{ startWord: string, goalWord: string } | null> => {
  try {
    const response = await fetch(`${BASE_URL}/randomwordpair?round=${roundNumber}&difficulty=${difficulty}`);

    if (!response.ok) {
      console.error('Failed to fetch random word pair');
      return null;
    }

    const data = await response.json();
    return {
      startWord: data.start_word,
      goalWord: data.goal_word,
    };
  } catch (error) {
    console.error('Error fetching random word pair:', error);
    return null;
  }
}


// TODO: Retrieve high score
export const fetchScores = async () => {
  return [];
}

export const saveScores = async (playerName, score, time, gameDate, version) => {
  try {
    const response = await fetch(`${BASE_URL}/savescore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: playerName,
        score: score,
        time: time,
        date: gameDate,
        version: version
      }),
    });

    if (!response.ok) {
      console.error('Failed to save score');
      return;
    }

    console.log('Score saved successfully');
  } catch (error) {
    console.error('Error saving score:', error);
  }
};
