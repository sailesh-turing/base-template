import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function App() {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    currentRound: 0,
    playerTurn: 1,
    angle: 0,
    timer: 15,
    player1: { score: 0, guess: '' },
    player2: { score: 0, guess: '' },
  });
  const [winner, setWinner] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (gameState.isPlaying && gameState.timer > 0) {
      intervalRef.current = setInterval(() => {
        setGameState(prevState => ({ ...prevState, timer: prevState.timer - 1 }));
      }, 1000);
    } else if (gameState.timer === 0) {
      clearInterval(intervalRef.current);
      evaluateGuess();
    }
    return () => clearInterval(intervalRef.current);
  }, [gameState.isPlaying, gameState.timer]);

  const startGame = () => {
    setGameState({
      isPlaying: true,
      currentRound: 1,
      playerTurn: 1,
      angle: Math.floor(Math.random() * 181),
      timer: 15,
      player1: { score: 0, guess: '' },
      player2: { score: 0, guess: '' },
    });
    setWinner(null);
  };

  const handleGuess = (player, value) => {
    setGameState(prevState => ({
      ...prevState,
      [player]: { ...prevState[player], guess: value }
    }));
  };

  const evaluateGuess = () => {
    const { angle, playerTurn, player1, player2 } = gameState;
    const currentPlayer = playerTurn === 1 ? 'player1' : 'player2';
    const guess = parseInt(gameState[currentPlayer].guess, 10) || 0;
    const difference = Math.abs(angle - guess);

    setGameState(prevState => ({
      ...prevState,
      [currentPlayer]: { ...prevState[currentPlayer], score: prevState[currentPlayer].score + difference },
      playerTurn: prevState.playerTurn === 1 ? 2 : 1,
      currentRound: prevState.currentRound + (prevState.playerTurn === 2 ? 1 : 0),
      angle: Math.floor(Math.random() * 181),
      timer: 15,
    }));

    if (gameState.currentRound === 6) {
      endGame();
    }
  };

  const endGame = () => {
    setGameState(prevState => ({ ...prevState, isPlaying: false }));
    const winner = gameState.player1.score < gameState.player2.score ? 'Player 1' : 'Player 2';
    setWinner(winner);
  };

  const AngleDisplay = ({ angle }) => (
    <div className="w-40 h-40 bg-slate-200 rounded-full relative flex items-center justify-center">
      <div className="w-1 h-20 bg-slate-800 absolute top-0"></div>
      <div className="w-40 h-40 rounded-full" style={{ clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.sin(angle * Math.PI / 180) * 50}% ${50 - Math.cos(angle * Math.PI / 180) * 50}%)` }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Angle Guessing Game</CardTitle>
        </CardHeader>
        <CardContent>
          {!gameState.isPlaying && (
            <Button onClick={startGame} className="w-full">Start Game</Button>
          )}
          {gameState.isPlaying && (
            <>
              <div className="text-center mb-4">
                <AngleDisplay angle={gameState.angle} />
                <p className="mt-2">Round {gameState.currentRound} of 6</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map(player => (
                  <div key={player} className={cn("p-2 rounded-lg", player === gameState.playerTurn ? "bg-blue-200" : "bg-slate-200")}>
                    <h3 className="font-semibold">Player {player}</h3>
                    <Input 
                      type="number" 
                      placeholder="Guess" 
                      value={gameState[`player${player}`].guess} 
                      onChange={(e) => handleGuess(`player${player}`, e.target.value)} 
                      disabled={gameState.playerTurn !== player}
                    />
                    <p>Score: {gameState[`player${player}`].score}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <p>Time Left: {gameState.timer}s</p>
              </div>
            </>
          )}
          {gameState.timer === 0 && gameState.isPlaying && (
            <div className="text-center mt-2">
              <p>Actual: {gameState.angle}°</p>
              <p>Guess: {gameState[`player${gameState.playerTurn}`].guess}°</p>
              <p>Difference: {Math.abs(gameState.angle - parseInt(gameState[`player${gameState.playerTurn}`].guess, 10))}°</p>
            </div>
          )}
        </CardContent>
        {winner && (
          <CardFooter className="animate-pulse">
            <p className="text-xl text-center font-bold text-green-600">Winner: {winner}!</p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default App;