import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Game = () => {
  const [gameState, setGameState] = useState('start'); // 'start', 'play', 'end'
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [angle, setAngle] = useState(0);
  const [playerGuess, setPlayerGuess] = useState({1: '', 2: ''});
  const [timeLeft, setTimeLeft] = useState(15);
  const [scores, setScores] = useState({1: 0, 2: 0});
  const [round, setRound] = useState(1);

  // Generate a new angle and reset timer
  useEffect(() => {
    if (gameState === 'play') {
      setAngle(Math.floor(Math.random() * 181));
      setTimeLeft(15);
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            evaluateGuess();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, currentPlayer]);

  const startGame = () => {
    setGameState('play');
    setRound(1);
    setScores({1: 0, 2: 0});
  };

  const handleGuess = (player, value) => {
    setPlayerGuess(prev => ({...prev, [player]: value}));
  };

  const evaluateGuess = () => {
    const difference = Math.abs(angle - parseInt(playerGuess[currentPlayer] || '0'));
    setScores(prevScores => ({
      ...prevScores,
       [currentPlayer]: prevScores[currentPlayer] + difference
    }));
    if (round < 6) {
      setRound(round + 1);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    } else {
      setGameState('end');
    }
  };

  const renderPieChart = () => {
    const radius = 50;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const offset = circumference - (angle / 180) * circumference;

    return (
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#333" 
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="skyblue"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 to-blue-500 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg p-4">
        <CardHeader>
          <CardTitle>Angle Guessing Game</CardTitle>
        </CardHeader>
        {gameState === 'start' && (
          <Button onClick={startGame}>Play</Button>
        )}
        {gameState === 'play' && (
          <>
            <div className="flex justify-center">{renderPieChart()}</div>
            <div className="text-center text-lg">Time Left: {timeLeft}</div>
            <div className="flex justify-between">
              {[1, 2].map(player => (
                <div key={player} className="w-1/2 p-2">
                  <h3>{`Player ${player}`}</h3>
                  <Input 
                    type="number" 
                    value={playerGuess[player]} 
                    onChange={(e) => handleGuess(player, e.target.value)} 
                    disabled={currentPlayer !== player}
                  />
                  <p>Score: {scores[player]}</p>
                </div>
              ))}
            </div>
          </>
        )}
        {gameState === 'end' && (
          <div>
            <h3 className="text-center">Winner: {scores[1] < scores[2] ? 'Player 1' : 'Player 2'}</h3>
            <p className="animate-pulse text-center">Congratulations!</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default function App() {
  return <Game />;
}