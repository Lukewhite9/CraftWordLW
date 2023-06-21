import React, { useState, useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';

function GameCountdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // Update the time left every second
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval if the component is unmounted
    return () => clearTimeout(timer);
  });

  // Calculate the difference between now and next midnight
  function calculateTimeLeft() {
    let now = new Date();
    let midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    let difference = midnight - now;

    let hoursLeft = Math.floor((difference / (1000 * 60 * 60)) % 24);
    let minutesLeft = Math.floor((difference / 1000 / 60) % 60);
    let secondsLeft = Math.floor((difference / 1000) % 60);

    return {
      hours: String(hoursLeft).padStart(2, '0'),
      minutes: String(minutesLeft).padStart(2, '0'),
      seconds: String(secondsLeft).padStart(2, '0')
    };
  }

  return (
    <Box fontSize="20px" fontWeight="bold" marginTop="20px">
      <Text textAlign="center">Next game starts in:</Text>
      <Text textAlign="center">{timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}</Text>
    </Box>
  );
}

export default GameCountdown;
