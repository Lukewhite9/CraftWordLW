const BASE_URL = 'https://back-end.lukewhite9.repl.co';

export const fetchScores = async (date: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/leaderboard?date=${date}`);
    if (!response.ok) {
      console.error('Failed to retrieve leaderboard scores');
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving leaderboard scores:', error);
    return [];
  }
};

export const saveHighScore = async (name: string, score: number, time: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/leaderboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        score,
        time,
      }),
    });
    if (!response.ok) {
      console.error('Failed to save high score');
    }
  } catch (error) {
    console.error(error);
  }
};

export const retrieveHighScore = async () => {
  try {
    const response = await fetch('https://back-end.lukewhite9.repl.co/leaderboard');
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error('Failed to retrieve high score');
    }
  } catch (error) {
    console.error(error);
  }
};
