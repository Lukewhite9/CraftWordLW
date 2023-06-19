import React, { useState, useEffect } from 'react';

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
    const textStyle = {
        fontSize: '20px', // Adjust as needed
        fontWeight: 'bold', // Makes the text bold
        marginTop: '20px', // Add space at the top
    };
  
    return (
        <div style={textStyle}>
            <h4>&nbsp;&nbsp;Next game starts in:</h4>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}</span>
        </div>
    );
}

export default GameCountdown;
