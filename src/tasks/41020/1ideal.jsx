import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GRID_SIZE = 4;
const GAME_DURATION = 20;
const CELL_COLORS = {
  default: 'bg-gray-100',
  selected: 'bg-blue-200',
  right: 'bg-green-300',
  wrong: 'bg-red-300',
  missed: 'bg-yellow-300'
};

const Cell = ({ value, isSelected, onClick, status }) => {
  const baseClasses = 'w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-lg sm:text-xl font-bold rounded-lg cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg';
  let colorClass = CELL_COLORS.default;

  if (status) {
    colorClass = CELL_COLORS[status];
  } else if (isSelected) {
    colorClass = CELL_COLORS.selected;
  }

  return (
    <div
      className={`${baseClasses} ${colorClass} ${isSelected ? 'scale-105' : ''}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
};

const GameBoard = ({ grid, selectedCells, onCellClick, gameStatus, cellStatuses }) => {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 mx-auto max-w-sm">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={cell}
            isSelected={selectedCells[rowIndex][colIndex]}
            onClick={() => onCellClick(rowIndex, colIndex)}
            status={cellStatuses[rowIndex][colIndex]}
          />
        ))
      )}
    </div>
  );
};

const Timer = ({ timeLeft }) => {
  return (
    <div className="text-3xl font-bold mb-6 text-center">
      {timeLeft}s
    </div>
  );
};

const Results = ({ right, wrong, missed }) => {
  return (
    <div className="mt-6 flex justify-center space-x-4 text-lg">
      <div className="flex items-center">
        <span className={`w-6 h-6 flex items-center justify-center ${CELL_COLORS.right} text-white rounded-full mr-2`}>✓</span>
        <span>{right}</span>
      </div>
      <div className="flex items-center">
        <span className={`w-6 h-6 flex items-center justify-center ${CELL_COLORS.wrong} text-white rounded-full mr-2`}>✗</span>
        <span>{wrong}</span>
      </div>
      <div className="flex items-center">
        <span className={`w-6 h-6 flex items-center justify-center ${CELL_COLORS.missed} text-white rounded-full mr-2`}>!</span>
        <span>{missed}</span>
      </div>
    </div>
  );
};

const generateGrid = () => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.floor(Math.random() * 100))
  );
};

const isValley = (grid, row, col) => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  const value = grid[row][col];
  return directions.every(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
      return true;
    }
    return value < grid[newRow][newCol];
  });
};

export default function App() {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [cellStatuses, setCellStatuses] = useState([]);
  const [gameStatus, setGameStatus] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [results, setResults] = useState({ right: 0, wrong: 0, missed: 0 });

  const initializeGame = useCallback(() => {
    const newGrid = generateGrid();
    setGrid(newGrid);
    setSelectedCells(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false)));
    setCellStatuses(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
    setGameStatus('playing');
    setTimeLeft(GAME_DURATION);
    setResults({ right: 0, wrong: 0, missed: 0 });
  }, []);

  useEffect(() => {
    if (gameStatus === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameStatus === 'playing' && timeLeft === 0) {
      evaluateGame();
    }
  }, [gameStatus, timeLeft]);

  const handleCellClick = useCallback((row, col) => {
    if (gameStatus === 'playing') {
      setSelectedCells(prev => {
        const newSelected = prev.map(row => [...row]);
        newSelected[row][col] = !newSelected[row][col];
        return newSelected;
      });
    }
  }, [gameStatus]);

  const evaluateGame = useCallback(() => {
    let right = 0, wrong = 0, missed = 0;
    const newCellStatuses = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isSelected = selectedCells[row][col];
        const isActualValley = isValley(grid, row, col);

        if (isSelected && isActualValley) {
          right++;
          newCellStatuses[row][col] = 'right';
        } else if (isSelected && !isActualValley) {
          wrong++;
          newCellStatuses[row][col] = 'wrong';
        } else if (!isSelected && isActualValley) {
          missed++;
          newCellStatuses[row][col] = 'missed';
        }
      }
    }

    setResults({ right, wrong, missed });
    setCellStatuses(newCellStatuses);
    setGameStatus('ended');
  }, [grid, selectedCells]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <Card className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Number Valley Game</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="mb-4 text-gray-600">Find the valleys in the number grid!</p>
              <Button 
                onClick={initializeGame} 
                disabled={gameStatus === 'playing'}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                {gameStatus === 'playing' ? 'Game in Progress' : 'Play'}
              </Button>
            </div>
            {gameStatus !== 'idle' && (
              <>
                <Timer timeLeft={timeLeft} />
                <GameBoard
                  grid={grid}
                  selectedCells={selectedCells}
                  onCellClick={handleCellClick}
                  gameStatus={gameStatus}
                  cellStatuses={cellStatuses}
                />
                {gameStatus === 'ended' && <Results {...results} />}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}