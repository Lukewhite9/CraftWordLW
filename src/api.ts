const BASE_URL = 'https://back-end-20.lukewhite9.repl.co';

export const fetchWordPair = async (roundNumber: number): Promise<[string, string] | []> => {
  const version = 1; // Define the version number

  try {
    const date = new Date();
    const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const response = await fetch(`${BASE_URL}/wordpairs?version=${version}&date=${dateKey}&round=${roundNumber}`);
    if (!response.ok) {
      console.error('Failed to fetch new word pair');
      return [];
    }

    const data = await response.json();
    return [data.start_word, data.goal_word];
  } catch (error) {
    console.error('Error fetching new word pair:', error);
    return [];
  }
};
