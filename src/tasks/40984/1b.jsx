import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function App() {
  return <AlphabetGame />;
}

function AlphabetGame() {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'ended'
  const [timeLeft, setTimeLeft] = useState(30);
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState(Array(5).fill(null));
  const [result, setResult] = useState(null);

  const generateQuestion = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = [];
    while (result.length < 5) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      if (!result.includes(char)) result.push(char);
    }
    return result.sort(() => Math.random() - 0.5); // Randomize order
  };

  useEffect(() => {
    if (gameState === 'playing') {
      if (timeLeft > 0) {
        const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timerId);
      } else {
        setGameState('ended');
        setResult(answer.join('') === question.sort().join('') ? 'You Win!' : 'You Lose!');
      }
    }
  }, [timeLeft, gameState, answer, question]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(30);
    setQuestion(generateQuestion());
    setAnswer(Array(5).fill(null));
    setResult(null);
  };

  const handleDrop = (index) => {
    return (event) => {
      const letter = event.dataTransfer.getData("text");
      let newAnswer = [...answer];
      if (!newAnswer[index]) {
        newAnswer[index] = letter;
        setAnswer(newAnswer);
      }
    };
  };

  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData("text", letter);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 sm:p-4">
      <GameHeader isPlaying={gameState === 'playing'} onStart={startGame} />
      <div className="flex flex-col space-y-4 w-full max-w-lg">
        <QuestionArea letters={question} onDragStart={handleDragStart} disabled={gameState !== 'playing'} />
        <AnswerArea answer={answer} onDrop={handleDrop} disabled={gameState !== 'playing'} />
        <Countdown timeLeft={timeLeft} />
        {result && <ResultArea result={result} />}
      </div>
    </div>
  );
}

function GameHeader({ isPlaying, onStart }) {
  return (
    <Card className="w-full max-w-lg mb-4">
      <CardContent className="text-center">
        <h1 className="text-3xl font-bold">Alphabet Order Game</h1>
        <Button onClick={onStart} disabled={isPlaying} className="mt-4">Play</Button>
      </CardContent>
    </Card>
  );
}

function QuestionArea({ letters, onDragStart, disabled }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {letters.map((letter, idx) => (
        <div 
          key={idx} 
          draggable={!disabled}
          onDragStart={(e) => onDragStart(e, letter)}
          className="bg-white p-4 text-center shadow-lg rounded cursor-move"
          style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}

function AnswerArea({ answer, onDrop, disabled }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {answer.map((letter, idx) => (
        <div 
          key={idx} 
          onDrop={onDrop(idx)} 
          onDragOver={(e) => e.preventDefault()}
          className={`border-2 border-dashed border-gray-300 p-4 text-center ${disabled ? 'opacity-50' : ''}`}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}

function Countdown({ timeLeft }) {
  return <div className="text-center text-xl">{timeLeft}s</div>;
}

function ResultArea({ result }) {
  return <div className="text-center text-2xl font-bold text-green-600">{result}</div>;
}