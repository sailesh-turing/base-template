// components/Countdown.jsx
import React from 'react';

const Countdown = ({ timeLeft }) => (
  <div className="text-center mt-4">
    <p>Time left: {timeLeft} seconds</p>
  </div>
);

export default Countdown;