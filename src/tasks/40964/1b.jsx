import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Sub-component for individual bar with radio buttons
const Bar = ({ height, index, userAnswer, setUserAnswer, result }) => {
  const isCorrect = result !== null ? result[index] === userAnswer[index] : null;

  return (
    <Card className="mb-4 w-16">
      <CardContent className="p-2">
        <div className="bg-blue-500 h-[100px] mb-2" style={{ height: `${height * 10}px` }}></div>
        <div className="flex justify-center">
          {[0, 1, 2].map(value => (
            <label key={value} className="mr-2">
              <input 
                type="radio" 
                name={`bar-${index}`} 
                value={value} 
                checked={userAnswer[index] === value} 
                onChange={() => setUserAnswer(prev => ({...prev, [index]: value}))}
                disabled={result !== null}
              />
              {value}
            </label>
          ))}
        </div>
        {result !== null && (
          <div className={`mt-2 text-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? 'Correct!' : 'Wrong!'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main App Component
export default function App() {
  const [numbers, setNumbers] = useState([]);
  const [userAnswer, setUserAnswer] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      setResults(numbers.map((_, index) => 
        numbers.filter((num, idx) => idx !== index && num > numbers[index]).length
      ));
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, numbers]);

  const startGame = () => {
    setNumbers(Array.from({length: 6}, () => Math.floor(Math.random() * 10) + 1));
    setUserAnswer({});
    setTimeLeft(30);
    setGameActive(true);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Count Taller Neighbours</h1>
        <Button 
          onClick={startGame} 
          disabled={gameActive}
          className="mt-4"
        >
          {gameActive ? 'Game in Progress' : 'Play'}
        </Button>
      </div>
      
      {gameActive && (
        <div>
          <div className="text-2xl mb-4 text-center text-purple-500">{timeLeft} seconds left</div>
          <div className="flex flex-wrap justify-center gap-4">
            {numbers.map((num, idx) => (
              <Bar 
                key={idx} 
                height={num} 
                index={idx} 
                userAnswer={userAnswer} 
                setUserAnswer={setUserAnswer}
                result={results}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}