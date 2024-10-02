import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Rocket, Star } from 'lucide-react';

const generateRandomAngle = () => Math.floor(Math.random() * 181);

const AnglePie = ({ angle }) => (
  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-slate-800 relative shadow-lg overflow-hidden">
    <div
      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500"
      style={{
        clipPath: `path('M 80 80 L 160 80 A 80 80 0 ${angle > 180 ? 1 : 0} 0 ${
          80 + 80 * Math.cos((angle * Math.PI) / 180)
        } ${80 - 80 * Math.sin((angle * Math.PI) / 180)} Z')`,
      }}
    />
    <div className="absolute top-1/2 right-0 h-0.5 w-1/2 bg-white opacity-50 transform translate-y-[-50%] origin-left" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-bold text-white">
      ?°
    </div>
  </div>
);

const PlayerArea = ({ player, currentPlayer, score, inputValue, onInputChange, disabled }) => (
  <Card className={`flex-1 ${currentPlayer === player ? 'ring-2 ring-indigo-400 shadow-lg' : ''} 
                    bg-slate-800`}>
    <CardHeader className="p-2 sm:p-4">
      <CardTitle className="text-center text-lg sm:text-xl text-white">
        Player {player}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-2 sm:p-4">
      <div className="flex flex-col items-center space-y-2">
        <Input
          type="number"
          min="0"
          max="180"
          value={inputValue}
          onChange={onInputChange}
          disabled={disabled}
          className="w-20 sm:w-24 text-center text-sm sm:text-base font-bold bg-slate-700 text-white border-slate-600"
        />
        <p className="text-sm sm:text-base font-semibold text-indigo-300">Score: {score}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-2 sm:p-4 space-y-4">
      <div className="max-w-2xl mx-auto space-y-4 relative z-10">
        <Card className="bg-slate-800 border-none shadow-xl">
          <CardHeader className="p-2 sm:p-4">
            <CardTitle className="text-2xl sm:text-3xl text-center text-white font-extrabold">
              Space Angle Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-2 sm:p-4">
            <Button 
              onClick={startGame} 
              disabled={gameState === 'playing'}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-sm sm:text-base px-4 py-2 rounded-md shadow-lg transform transition hover:scale-105"
            >
              {gameState === 'idle' ? 'Start Mission' : 'New Mission'}
            </Button>
          </CardContent>
        </Card>

        {gameState !== 'idle' && (
          <>
            <Card className="bg-slate-800 border-none shadow-xl">
              <CardContent className="flex flex-col items-center space-y-4 p-2 sm:p-4">
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-300">Round {currentRound}</h2>
                <AnglePie angle={currentAngle} />
                <div className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1 rounded-md shadow-md">
                  {countdown}s
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-2 sm:space-x-4">
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
              <Card className="bg-slate-800 border-none shadow-lg">
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="text-yellow-400 w-4 h-4 sm:w-6 sm:h-6" />
                    <p className="text-sm sm:text-base font-bold text-white">
                      Actual: {lastRoundResult.actual}°, 
                      Guess: {lastRoundResult.guess}°, 
                      Diff: {lastRoundResult.difference}°
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {winner && (
              <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 border-none shadow-xl">
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Rocket className="text-white animate-pulse w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="text-lg sm:text-xl font-extrabold text-white">
                      Player {winner} Wins the Mission!
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