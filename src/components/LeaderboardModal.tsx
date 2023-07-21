import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { fetchScores } from "../api/api"
import { ScoresContext } from './ScoresContext';

type Score = {
  name: string;
  score: number;
  time: number;
};

type LeaderboardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const fetchData = async () => {
      const currentDate = getCurrentDate();
      const scores = await fetchScores(currentDate);
      
      scores.sort((a, b) => {
        if (a.score !== b.score) {
          return b.score - a.score; 
        } else {
          return a.time - b.time; 
        }
      });
      setScores(scores);
    };

    fetchData();
  }, [isOpen]);


  // Get the current date in the format YYYY-MM-DD
  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Update the current date every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setCurrentDate(getCurrentDate());
    }
  }, [isOpen]);
  
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={4} mb={-4} textAlign="center">Leaderboard</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeaderboardModal;

