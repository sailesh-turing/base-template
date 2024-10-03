import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const GAME_DURATION = 30;
const NUM_BARS = 6;

const generateRandomBars = () => {
  return Array.from({ length: NUM_BARS }, () => Math.floor(Math.random() * 10) + 1);
};

const countTallerNeighbors = (bars) => {
  return bars.map((bar, index) => {
    let count = 0;
    if (index > 0 && bars[index - 1] > bar) count++;
    if (index < bars.length - 1 && bars[index + 1] > bar) count++;
    return count;
  });
};

const BarGraph = ({ bars, userAnswers, setUserAnswers, showResults, correctAnswers, gameActive }) => {
  const maxHeight = 150; // Reduced max height
  const barWidth = 30; // Slightly reduced bar width
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

  return (
    <div className="grid grid-cols-6 gap-2 w-full">
      {bars.map((bar, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="h-40 flex items-end justify-center w-full">
            <div
              className="rounded-t-lg transition-all duration-300 shadow-md"
              style={{
                height: `${(bar / 10) * maxHeight}px`,
                width: `${barWidth}px`,
                backgroundColor: colors[index],
              }}
            ></div>
          </div>
          <RadioGroup
            className="mt-2 bg-white p-2 rounded-lg shadow-md w-full"
            value={userAnswers[index]?.toString() || ""}
            onValueChange={(value) => {
              if (gameActive) {
                const newAnswers = [...userAnswers];
                newAnswers[index] = parseInt(value);
                setUserAnswers(newAnswers);
              }
            }}
            disabled={!gameActive}
          >
            {[0, 1, 2].map((option) => (
              <div key={option} className="flex items-center space-x-1 mb-1">
                <RadioGroupItem 
                  value={option.toString()} 
                  id={`option-${index}-${option}`} 
                  disabled={!gameActive}
                  className="text-purple-600"
                />
                <Label htmlFor={`option-${index}-${option}`} className="text-gray-700 text-sm">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {showResults && (
            <div className={`mt-2 font-bold text-2xl ${userAnswers[index] === correctAnswers[index] ? 'text-green-500' : 'text-red-500'}`}>
              {userAnswers[index] === correctAnswers[index] ? '✓' : '✗'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const CountdownTimer = ({ timeLeft }) => (
  <div className="text-3xl font-bold mb-4 text-center bg-yellow-300 p-4 rounded-full shadow-lg">
    {timeLeft} seconds left!
  </div>
);

const PlayButton = ({ onClick, disabled }) => (
  <Button 
    onClick={onClick} 
    disabled={disabled} 
    className="mb-4 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-pink-500 hover:to-purple-400 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition hover:scale-105"
  >
    {disabled ? 'Game in progress' : 'Play Now!'}
  </Button>
);

const GameBoard = () => {
  const [bars, setBars] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState(Array(NUM_BARS).fill(null));
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameActive, setGameActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const startGame = useCallback(() => {
    const newBars = generateRandomBars();
    setBars(newBars);
    setCorrectAnswers(countTallerNeighbors(newBars));
    setUserAnswers(Array(NUM_BARS).fill(null));
    setTimeLeft(GAME_DURATION);
    setGameActive(true);
    setShowResults(false);
  }, []);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      setShowResults(true);
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6">
        <CardTitle className="text-3xl sm:text-4xl text-center mb-4 font-extrabold">Count Taller Neighbors</CardTitle>
        <div className="flex justify-center">
          <PlayButton onClick={startGame} disabled={gameActive} />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {(gameActive || showResults) && (
          <>
            <BarGraph
              bars={bars}
              userAnswers={userAnswers}
              setUserAnswers={setUserAnswers}
              showResults={showResults}
              correctAnswers={correctAnswers}
              gameActive={gameActive}
            />
            <CountdownTimer timeLeft={timeLeft} />
          </>
        )}
        {!gameActive && !showResults && (
          <div className="text-center text-2xl text-gray-600 animate-bounce">
            Click Play Now! to start the game!
          </div>
        )}
        {showResults && (
          <div className="text-center text-2xl mt-4 bg-green-100 p-4 rounded-lg shadow-inner animate-bounce">
            Game Over! To start a new game, click Play Now!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-indigo-200 flex items-center justify-center p-4">
      <GameBoard />
    </div>
  );
}