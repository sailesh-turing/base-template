// App.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ExpressionDisplay from './components/ExpressionDisplay';
import TruthTable from './components/TruthTable';
import Countdown from './components/Countdown';

const App = () => {
  const [expression, setExpression] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);

  const generateExpression = () => {
    // Simplified expression generation logic
    const ops = ['&&', '||'];
    const vars = ['A', 'B', 'C', 'D'];
    let expr = '';
    for (let i = 0; i < 3; i++) {
      expr += vars[Math.floor(Math.random() * vars.length)];
      expr += ' ' + ops[Math.floor(Math.random() * ops.length)] + ' ';
    }
    expr += vars[Math.floor(Math.random() * vars.length)];
    setExpression(expr);
    setUserAnswers(new Array(16).fill(null));
  };

  useEffect(() => {
    let timer;
    if (isGameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
      // Here you would evaluate answers, but for simplicity, we'll skip this
    }
    return () => clearTimeout(timer);
  }, [isGameActive, timeLeft]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Truth Table Practice</h1>
      <Button onClick={generateExpression} disabled={isGameActive}>
        Generate New Expression
      </Button>
      {expression && (
        <Card className="mt-4 w-full max-w-lg">
          <CardContent>
            <ExpressionDisplay expression={expression} />
            <TruthTable expression={expression} userAnswers={userAnswers} setUserAnswers={setUserAnswers} />
            <Countdown timeLeft={timeLeft} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;