import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const generateExpression = () => {
  const operators = ["AND", "OR"];
  const getRandomOperator = () => operators[Math.floor(Math.random() * operators.length)];
  
  const op1 = getRandomOperator();
  const op2 = getRandomOperator();
  const op3 = getRandomOperator();
  
  const parenthesizations = [
    `(A ${op1} B) ${op2} (C ${op3} D)`,
    `((A ${op1} B) ${op2} C) ${op3} D`,
    `A ${op1} (B ${op2} (C ${op3} D))`,
    `A ${op1} ((B ${op2} C) ${op3} D)`,
    `(A ${op1} (B ${op2} C)) ${op3} D`
  ];
  
  return parenthesizations[Math.floor(Math.random() * parenthesizations.length)];
};

const evaluateExpression = (expression, values) => {
  const evalExpr = expression
    .replace(/AND/g, "&&")
    .replace(/OR/g, "||")
    .replace(/A/g, values.A)
    .replace(/B/g, values.B)
    .replace(/C/g, values.C)
    .replace(/D/g, values.D);
  return eval(evalExpr) ? 1 : 0;
};

const TruthTable = ({ expression, answers, setAnswers, isGameActive, results }) => {
  const variables = ["A", "B", "C", "D"];
  const rows = Array(16)
    .fill()
    .map((_, i) => ({
      A: (i >> 3) & 1,
      B: (i >> 2) & 1,
      C: (i >> 1) & 1,
      D: i & 1,
    }));

  const handleInputChange = (rowIndex, value) => {
    setAnswers({ ...answers, [rowIndex]: value });
  };

  return (
    <div className="overflow-y-auto max-h-[calc(100vh-350px)] mt-6 rounded-lg shadow-inner bg-gradient-to-b from-blue-50 to-indigo-50">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <tr>
            {variables.map((v) => (
              <th key={v} className="border-b border-blue-400 p-3 font-semibold">
                {v}
              </th>
            ))}
            <th className="border-b border-blue-400 p-3 font-semibold">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-white bg-opacity-50" : "bg-blue-50 bg-opacity-50"}>
              {variables.map((v) => (
                <td key={v} className="border-b border-blue-200 p-3 text-center font-medium text-blue-800">
                  {row[v]}
                </td>
              ))}
              <td className="border-b border-blue-200 p-3">
                {isGameActive ? (
                  <div className="flex justify-center">
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      value={answers[index] || ""}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-16 text-center border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2 font-medium text-blue-800">{answers[index] === undefined ? "-" : answers[index]}</span>
                    {results && (
                      <span className={`text-2xl ${
                        results[index].answer === results[index].correct 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {results[index].answer === results[index].correct ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Countdown = ({ time, onComplete }) => {
  const [remainingTime, setRemainingTime] = useState(time);

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [remainingTime, onComplete]);

  return (
    <div className="text-3xl font-bold text-center mb-4 text-blue-700">
      Time remaining: {remainingTime}s
    </div>
  );
};

export default function App() {
  const [expression, setExpression] = useState("");
  const [isGameActive, setIsGameActive] = useState(false);
  const [results, setResults] = useState(null);
  const [answers, setAnswers] = useState({});

  const startNewGame = () => {
    setExpression(generateExpression());
    setIsGameActive(true);
    setResults(null);
    setAnswers({});
  };

  const handleGameComplete = () => {
    const rows = Array(16)
      .fill()
      .map((_, i) => ({
        A: (i >> 3) & 1,
        B: (i >> 2) & 1,
        C: (i >> 1) & 1,
        D: i & 1,
      }));

    const newResults = rows.map((row, index) => ({
      correct: evaluateExpression(expression, row),
      answer: answers[index] === undefined ? undefined : parseInt(answers[index]),
    }));

    setResults(newResults);
    setIsGameActive(false);
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-blue-100 to-indigo-100 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-3xl shadow-2xl bg-white bg-opacity-90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">
            Truth Table Practice
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Button
            onClick={startNewGame}
            disabled={isGameActive}
            className="w-full mb-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            {isGameActive ? "Game in Progress" : "Generate New Expression"}
          </Button>

          {expression && (
            <div className="mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-bold mb-2 text-blue-800">Boolean Expression:</h2>
              <div className="p-4 bg-white rounded-lg text-center text-lg font-medium text-blue-900 shadow-inner">
                {expression}
              </div>
            </div>
          )}

          {isGameActive && (
            <Countdown time={30} onComplete={handleGameComplete} />
          )}

          {expression && (
            <TruthTable
              expression={expression}
              answers={answers}
              setAnswers={setAnswers}
              isGameActive={isGameActive}
              results={results}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}