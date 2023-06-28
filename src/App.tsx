import { ChakraProvider } from '@chakra-ui/react';

import GamePage from './pages/GamePage';

export default function App() {
  return (
    <ChakraProvider>
      <GamePage />
    </ChakraProvider>
  );
}
