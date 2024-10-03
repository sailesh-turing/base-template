import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getRandomLetters() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = [];
  for (let i = 0; i < 5; i++) {
    result.push(letters[Math.floor(Math.random() * letters.length)]);
  }
  return result.sort(() => Math.random() - 0.5);
}

const GameHeader = ({ onStartGame, isGameRunning }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Alphabet Order Game</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <Button onClick={onStartGame} disabled={isGameRunning}>Play</Button>
    </CardContent>
  </Card>
);

const QuestionArea = ({ letters }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Arrange These Letters</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center space-x-2">
      {letters.map((letter, idx) => (
        <div key={idx} className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg transform hover:scale-105 transition-all border-2 border-blue-600 rounded-lg">{letter}</div>
      ))}
    </CardContent>
  </Card>
);

const AnswerArea = ({ playerOrder, onDrop }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>Your Answer</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center space-x-2">
      {[...Array(5)].map((_, idx) => (
        <div 
          key={idx} 
          className="w-12 h-12 bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold rounded-lg shadow-inner"
          onDrop={() => onDrop(idx)} 
          onDragOver={(e) => e.preventDefault()}
        >
          {playerOrder[idx]}
        </div>
      ))}
    </CardContent>
  </Card>
);

const Countdown = ({ timeLeft }) => (
  <div className="text-center text-2xl mb-4 font-semibold text-red-500">{timeLeft}s</div>
);

const Result = ({ result }) => (
  <div className={`text-center text-xl ${result === 'Win' ? 'text-green-500' : 'text-red-500'}`}>{result}</div>
);

export default function App() {
  const [letters, setLetters] = useState([]);
  const [playerOrder, setPlayerOrder] = useState(Array(5).fill(''));
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let timer;
    if (isGameRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsGameRunning(false);
      setResult(playerOrder.join('') === letters.sort().join('') ? 'Win' : 'Lose');
    }
    return () => clearInterval(timer);
  }, [isGameRunning, timeLeft]);

  const startGame = () => {
    setLetters(getRandomLetters());
    setPlayerOrder(Array(5).fill(''));
    setIsGameRunning(true);
    setTimeLeft(30);
    setResult(null);
  };

  const handleDrop = (index) => {
    if (!isGameRunning) return;
    const letter = letters.find(l => !playerOrder.includes(l));
    if (letter) {
      const newOrder = [...playerOrder];
      newOrder[index] = letter;
      setPlayerOrder(newOrder);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto sm:px-6 lg:px-8">
      <GameHeader onStartGame={startGame} isGameRunning={isGameRunning} />
      {isGameRunning && (
        <>
          <QuestionArea letters={letters} />
          <AnswerArea playerOrder={playerOrder} onDrop={handleDrop} />
          <Countdown timeLeft={timeLeft} />
        </>
      )}
      {result && <Result result={result} />}
    </div>
  );
}