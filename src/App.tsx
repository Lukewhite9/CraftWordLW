import { ChakraProvider } from '@chakra-ui/react';

import MainTmp from './components/MainTmp';

export default function App() {
  return (
    <ChakraProvider>
      <MainTmp />
    </ChakraProvider>
  );
}
