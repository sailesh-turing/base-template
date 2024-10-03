import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function App() {
  const [bars, setBars] = useState([]);
  const [userAnswers, setUserAnswers] = useState(Array(6).fill(null));
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [results, setResults] = useState(Array(6).fill(null));

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      checkAnswers();
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const startGame = () => {
    const newBars = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10) + 1);
    setBars(newBars);
    setUserAnswers(Array(6).fill(null));
    setResults(Array(6).fill(null));
    setTimeLeft(30);
    setGameActive(true);
  };

  const checkAnswers = () => {
    const correctCounts = bars.map((height, index) => 
      bars.filter((h, i) => i !== index && h > height).length
    );
    setResults(correctCounts.map((correct, i) => correct === userAnswers[i] ? 'correct' : 'wrong'));
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-8">
      <Card className="w-full max-w-sm p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Count Taller Neighbours</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={startGame} disabled={gameActive} className="mb-4 w-full">
            {gameActive ? "Game in Progress" : "Play"}
          </Button>
          {gameActive && 
            <div className="text-center mb-4 text-lg font-semibold">
              Time Left: {timeLeft}s
            </div>
          }
          <BarGraph bars={bars} userAnswers={userAnswers} onChange={handleAnswerChange} results={results} gameActive={gameActive} />
        </CardContent>
      </Card>
    </div>
  );
}

function BarGraph({ bars, userAnswers, onChange, results, gameActive }) {
  return (
    <div className="grid gap-2">
      {bars.map((height, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-8 h-40 bg-gradient-to-t from-blue-300 to-blue-600 mb-2" style={{ height: `${height * 10}%` }}></div>
          <div className="flex space-x-2">
            {[0, 1, 2].map(value => (
              <label key={value} className="flex items-center">
                <input 
                  type="radio" 
                  name={`bar-${index}`} 
                  value={value} 
                  checked={userAnswers[index] === value} 
                  onChange={() => onChange(index, value)} 
                  disabled={!gameActive}
                  className="mr-1"
                />
                {value}
              </label>
            ))}
          </div>
          {results[index] && 
            <div className={`mt-1 text-sm ${results[index] === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
              {results[index] === 'correct' ? '✓' : '✗'}
            </div>
          }
        </div>
      ))}
    </div>
  );
}

export default App;