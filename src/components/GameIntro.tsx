import {
  Box,
  Text,
  Link,
} from '@chakra-ui/react';

type GameIntroProps = {
  onLearnModalOpen: () => void;
};

const GameIntro: React.FC<GameIntroProps> = ({ onLearnModalOpen }) => {
  return (
    <Box fontSize="lg" mt="8">
      <Text as="span">
        Get from{' '}
      </Text>
      <Text as="span" color="green.500" fontWeight="semibold">
        START
      </Text>{' '}
      to{' '}
      <Text as="span" color="blue.500" fontWeight="semibold">
        GOAL
      </Text>{' '}
      in as few words as possible.{' '}
      <Text as="span">
        First time?{' '}
        <Link fontWeight="semibold" textColor="green.500" onClick={onLearnModalOpen}>Read the rules</Link>.
      </Text>
    </Box>
  )
}

export default GameIntro;