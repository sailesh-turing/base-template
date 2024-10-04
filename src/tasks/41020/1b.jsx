import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = {
  default: 'bg-slate-100',
  selected: 'bg-blue-500',
  correct: 'bg-green-500',
  incorrect: 'bg-red-500',
  missed: 'bg-yellow-500'
};

function Cell({ value, isValley, selected, onClick, status }) {
  const cellColor = () => {
    if (status === 'correct') return colors.correct;
    if (status === 'incorrect') return colors.incorrect;
    if (status === 'missed') return colors.missed;
    return selected ? colors.selected : colors.default;
  };

  return (
    <div className={`w-12 h-12 flex items-center justify-center text-lg font-bold ${cellColor()} border border-slate-300 sm:w-16 sm:h-16`} onClick={onClick}>
      {value}
    </div>
  );
}

function Grid({ numbers, onSelect, gameStatus }) {
  const isValley = (i, j) => {
    const current = numbers[i][j];
    const neighbors = [
      [i-1, j-1], [i-1, j], [i-1, j+1],
      [i, j-1],             [i, j+1],
      [i+1, j-1], [i+1, j], [i+1, j+1]
    ].filter(([x, y]) => x >= 0 && x < 4 && y >= 0 && y < 4);

    return neighbors.every(([x, y]) => current < numbers[x][y]);
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      {numbers.map((row, i) => row.map((num, j) => (
        <Cell 
          key={`${i}-${j}`} 
          value={num} 
          isValley={isValley(i, j)} 
          selected={gameStatus.selected[i][j]} 
          onClick={() => onSelect(i, j)} 
          status={gameStatus.evaluation[i][j]}
        />
      )))}
    </div>
  );
}

function Timer({ onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  return <div className="text-2xl mb-4">Time: {timeLeft}s</div>;
}

function Result({ right, wrong, missed }) {
  return (
    <div className="mt-4">
      <p className={`text-green-500`}>Right: {right}</p>
      <p className={`text-red-500`}>Wrong: {wrong}</p>
      <p className={`text-yellow-500`}>Missed: {missed}</p>
    </div>
  );
}

export default function App() {
  const [gameStatus, setGameStatus] = useState({
    playing: false,
    selected: Array(4).fill().map(() => Array(4).fill(false)),
    evaluation: Array(4).fill().map(() => Array(4).fill(null)),
    results: { right: 0, wrong: 0, missed: 0 }
  });
  const [numbers, setNumbers] = useState([]);

  const startGame = () => {
    const newNumbers = Array.from({ length: 4 }, () => 
      Array.from({ length: 4 }, () => Math.floor(Math.random() * 100))
    );
    setNumbers(newNumbers);
    setGameStatus({
      playing: true,
      selected: Array(4).fill().map(() => Array(4).fill(false)),
      evaluation: Array(4).fill().map(() => Array(4).fill(null)),
      results: { right: 0, wrong: 0, missed: 0 }
    });
  };

  const selectCell = (i, j) => {
    if (!gameStatus.playing) return;
    const newSelected = gameStatus.selected.map(row => [...row]);
    newSelected[i][j] = !newSelected[i][j];
    setGameStatus(prev => ({ ...prev, selected: newSelected }));
  };

  const evaluateGame = () => {
    let newEvaluation = gameStatus.evaluation.map(row => [...row]);
    let { right, wrong, missed } = gameStatus.results;
    
    numbers.forEach((row, i) => row.forEach((num, j) => {
      if (gameStatus.selected[i][j]) {
        if (newEvaluation[i][j] === 'correct' || newEvaluation[i][j] === 'incorrect') return;
        newEvaluation[i][j] = gameStatus.selected[i][j] === true ? (num < Math.min(...getNeighbors(i, j).map(([x, y]) => numbers[x][y])) ? 'correct' : 'incorrect') : null;
        if (newEvaluation[i][j] === 'correct') right++;
        else if (newEvaluation[i][j] === 'incorrect') wrong++;
      } else if (num < Math.min(...getNeighbors(i, j).map(([x, y]) => numbers[x][y]))) {
        newEvaluation[i][j] = 'missed';
        missed++;
      }
    }));

    setGameStatus(prev => ({ 
      ...prev, 
      playing: false, 
      evaluation: newEvaluation, 
      results: { right, wrong, missed } 
    }));
  };

  const getNeighbors = (i, j) => [
    [i-1, j-1], [i-1, j], [i-1, j+1],
    [i, j-1],             [i, j+1],
    [i+1, j-1], [i+1, j], [i+1, j+1]
  ].filter(([x, y]) => x >= 0 && x < 4 && y >= 0 && y < 4);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Number Valley Game</CardTitle>
        </CardHeader>
        <CardContent>
          {!gameStatus.playing && <Button onClick={startGame} disabled={gameStatus.playing}>Play</Button>}
          {gameStatus.playing && <Timer onTimeUp={evaluateGame} />}
          <Grid numbers={numbers} onSelect={selectCell} gameStatus={gameStatus} />
          {!gameStatus.playing && (
            <Result {...gameStatus.results} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}