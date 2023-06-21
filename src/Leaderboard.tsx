import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

type Score = {
  name: string;
  score: number;
  time: number;
};

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const currentDate = getCurrentDate();
        const response = await fetch(`https://back-end.lukewhite9.repl.co/leaderboard?date=${currentDate}`);
        if (response.ok) {
          const data = await response.json();
          setScores(data);
        } else {
          console.error('Failed to retrieve leaderboard scores');
        }
      } catch (error) {
        console.error('Error retrieving leaderboard scores:', error);
      }
    };

    fetchScores();
  }, []);

  return (
  <Box mt="4">
    <h2>Best scores for {getCurrentDate()}</h2>
    {scores.length === 0 ? (
      <p>No scores available for this date</p>
    ) : (
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Score</Th>
            <Th>Time</Th>
          </Tr>
        </Thead>
        <Tbody>
          {scores.map((score, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{score.name}</Td>
              <Td>{score.score}</Td>
              <Td>{score.time} seconds</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

// Get the current date in the format YYYY-MM-DD
function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default Leaderboard;
