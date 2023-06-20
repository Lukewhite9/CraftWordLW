import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
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
        const response = await fetch(
          'https://back-end.lukewhite9.repl.co/leaderboard'
        );
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
    <Box>
      <Table variant="striped">
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

export default Leaderboard;
