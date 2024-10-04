import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const App = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameActive, setGameActive] = useState(false);
  const [result, setResult] = useState({ right: 0, wrong: 0, missed: 0 });

  const startGame = () => {
    const newGrid = Array.from({ length: 16 }, () => Math.floor(Math.random() * 100));
    setGrid(newGrid);
    setSelectedCells([]);
    setTimeLeft(20);
    setGameActive(true);
    setResult({ right: 0, wrong: 0, missed: 0 });
  };

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      evaluateGame();
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive]);

  const evaluateGame = () => {
    const evaluation = grid.map((num, index) => {
      const isValley = isCellValley(index, grid);
      if (selectedCells.includes(index)) {
        return isValley ? 'right' : 'wrong';
      }
      return isValley ? 'missed' : 'default';
    });
    
    setResult({
      right: evaluation.filter(e => e === 'right').length,
      wrong: evaluation.filter(e => e === 'wrong').length,
      missed: evaluation.filter(e => e === 'missed').length
    });
  };

  const isCellValley = (index, grid) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    const value = grid[index];
    return directions.every(([dx, dy]) => {
      const newIndex = index + dx + dy * 4;
      return newIndex < 0 || newIndex >= 16 || grid[newIndex] > value;
    });
  };

  const handleCellClick = (index) => {
    if (!gameActive) return;
    setSelectedCells(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Number Valley Game</h1>
      {gameActive ? (
        <>
          <Countdown time={timeLeft} />
          <GameBoard grid={grid} onCellClick={handleCellClick} selectedCells={selectedCells} result={result} />
        </>
      ) : (
        <>
          <Button onClick={startGame} disabled={gameActive}>Start Game</Button>
          {result.right + result.wrong + result.missed > 0 && <Result {...result} />}
        </>
      )}
    </div>
  );
};

const GameBoard = ({ grid, onCellClick, selectedCells, result }) => {
  const cellStatus = (index) => {
    if (result.right + result.wrong + result.missed > 0) {
      return result[index] || 'default';
    }
    return selectedCells.includes(index) ? 'selected' : 'default';
  };

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {grid.map((num, index) => (
        <Card key={index} className={`cursor-pointer ${cellStatus(index)}`} onClick={() => onCellClick(index)}>
          <CardContent className="p-2 text-center">
            {num}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Countdown = ({ time }) => (
  <div className="text-center text-xl mb-4">Time Left: {time}</div>
);

const Result = ({ right, wrong, missed }) => (
  <div className="mt-4 text-center">
    <p className="text-green-500">Right: {right}</p>
    <p className="text-red-500">Wrong: {wrong}</p>
    <p className="text-yellow-500">Missed: {missed}</p>
  </div>
);

export default App;