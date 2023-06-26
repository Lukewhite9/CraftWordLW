import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  Text,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { fetchScores } from './api';

type Score = {
  name: string;
  score: number;
  time: number;
};

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentDate = getCurrentDate();
      const data = await fetchScores(currentDate);
      setScores(data);
    };
    
    fetchData();
  }, []);
  
  return (
  <Box mt="4">
            <Text mb={2} fontWeight="semibold" textAlign="center">Best scores for {currentDate}</Text>
            {scores.length === 0 ? (
              <p>No scores available for this date</p>
            ) : (
              <Table size="sm" variant="striped" colorScheme="gray">
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
                      <Td>{score.time}</Td> 
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
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
