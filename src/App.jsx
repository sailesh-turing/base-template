import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Trophy } from 'lucide-react';

const generateRandomAngle = () => Math.floor(Math.random() * 181);

const AnglePie = ({ angle }) => (
  <div className="w-48 h-48 rounded-full bg-blue-200 relative overflow-hidden">
    <div
      className="absolute top-0 left-0 w-full h-full bg-blue-500"
      style={{
        clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.sin(angle * Math.PI / 180)}% ${50 - 50 * Math.cos(angle * Math.PI / 180)}%)`,
      }}
    />
    <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-black transform -translate-x-1/2 origin-bottom" />
  </div>
);

const PlayerArea = ({ player, currentPlayer, score, inputValue, onInputChange, disabled }) => (
  <Card className={`flex-1 ${currentPlayer === player ? 'border-green-500 border-2' : ''}`}>
    <CardHeader>
      <CardTitle className="text-center">Player {player}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col items-center space-y-2">
        <Input
          type="number"
          min="0"
          max="180"
          value={inputValue}
          onChange={onInputChange}
          disabled={disabled}
          className="w-24 text-center"
        />
        <p className="text-lg font-semibold">Score: {score}</p>
      </div>
    </CardContent>
  </Card>
);

export default function AngleGuessingGame() {
  const [gameState, setGameState] = useState('idle');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [countdown, setCountdown] = useState(15);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [inputs, setInputs] = useState({ 1: '', 2: '' });
  const [lastRoundResult, setLastRoundResult] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (gameState === 'playing' && countdown === 0) {
      handleRoundEnd();
    }
    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  const startGame = () => {
    setGameState('playing');
    setCurrentRound(1);
    setCurrentPlayer(1);
    setCurrentAngle(generateRandomAngle());
    setCountdown(15);
    setScores({ 1: 0, 2: 0 });
    setInputs({ 1: '', 2: '' });
    setLastRoundResult(null);
    setWinner(null);
  };

  const handleInputChange = (player, value) => {
    setInputs(prev => ({ ...prev, [player]: value }));
  };

  const handleRoundEnd = () => {
    const playerGuess = parseInt(inputs[currentPlayer], 10);
    const difference = Math.abs(playerGuess - currentAngle);
    setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + difference }));
    setLastRoundResult({ actual: currentAngle, guess: playerGuess, difference });

    if (currentRound === 6) {
      const winner = scores[1] <= scores[2] ? 1 : 2;
      setWinner(winner);
      setGameState('finished');
    } else {
      setCurrentRound(currentRound + 1);
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setCurrentAngle(generateRandomAngle());
      setCountdown(15);
      setInputs(prev => ({ ...prev, [currentPlayer]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-200 to-pink-200 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center text-purple-700">Angle Guessing Game</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={startGame} disabled={gameState === 'playing'}>
              {gameState === 'idle' ? 'Start Game' : 'New Game'}
            </Button>
          </CardContent>
        </Card>

        {gameState !== 'idle' && (
          <>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-4">
                <h2 className="text-2xl font-bold">Round {currentRound}</h2>
                <AnglePie angle={currentAngle} />
                <div className="text-3xl font-bold">{countdown}s</div>
              </CardContent>
            </Card>

            <div className="flex space-x-4">
              <PlayerArea
                player={1}
                currentPlayer={currentPlayer}
                score={scores[1]}
                inputValue={inputs[1]}
                onInputChange={(e) => handleInputChange(1, e.target.value)}
                disabled={currentPlayer !== 1 || gameState !== 'playing'}
              />
              <PlayerArea
                player={2}
                currentPlayer={currentPlayer}
                score={scores[2]}
                inputValue={inputs[2]}
                onInputChange={(e) => handleInputChange(2, e.target.value)}
                disabled={currentPlayer !== 2 || gameState !== 'playing'}
              />
            </div>

            {lastRoundResult && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="text-yellow-500" />
                    <p>
                      Actual: {lastRoundResult.actual}°, 
                      Guess: {lastRoundResult.guess}°, 
                      Difference: {lastRoundResult.difference}°
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {winner && (
              <Card className="bg-gradient-to-r from-yellow-300 to-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="text-yellow-800 animate-pulse" size={32} />
                    <p className="text-2xl font-bold text-yellow-900">
                      Player {winner} Wins!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}