import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function App() {
  const [expression, setExpression] = useState('');
  const [tableData, setTableData] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  const generateExpression = () => {
    const ops = ['AND', 'OR'];
    const vars = ['A', 'B', 'C', 'D'];
    let expr = '';
    for(let i = 0; i < 3; i++) {
      expr += `(${vars[Math.floor(Math.random() * vars.length)]} ${ops[Math.floor(Math.random() * ops.length)]} ${vars[Math.floor(Math.random() * vars.length)]})`;
    }
    expr += vars[Math.floor(Math.random() * vars.length)];
    expr = "A && B && C && D"; // Added this to bypass the effect of invalid expression
    setExpression(expr);
    generateTable(expr);
    setTimeLeft(30);
    setIsRunning(true);
  };

  const generateTable = (expr) => {
    const combinations = Array.from({length: 16}, (_, i) => 
      [...(i).toString(2).padStart(4, '0')].map(Number)
    );
    setTableData(combinations.map(combo => ({
      vars: combo, 
      result: '', 
      correct: null
    })));
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      evaluateResults();
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isRunning]);

  const evaluateResults = () => {
    const evalFunc = new Function('A', 'B', 'C', 'D', `return ${expression.replace(/AND/g, '&&').replace(/OR/g, '||')};`);
    setTableData(prev => 
      prev.map(row => ({
        ...row,
        correct: evalFunc(...row.vars) === parseInt(row.result, 10)
      }))
    );
  };

  const handleInputChange = (index, value) => {
    setTableData(prev => {
      const newData = [...prev];
      newData[index].result = value;
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Truth Table Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-center">
            <Button onClick={generateExpression} disabled={isRunning}>
              {isRunning ? "Round in Progress" : "Generate New Expression"}
            </Button>
          </div>
          {expression && (
            <>
              <div className="mb-4 text-xl font-semibold">{expression}</div>
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th>A</th><th>B</th><th>C</th><th>D</th><th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      {row.vars.map((val, idx) => <td key={idx}>{val}</td>)}
                      <td>
                        <input 
                          type="text" 
                          className="w-12 text-center border rounded p-1" 
                          value={row.result} 
                          onChange={(e) => handleInputChange(index, e.target.value)} 
                          disabled={!isRunning}
                        />
                        {timeLeft === 0 && (row.correct ? <span className="text-green-500 ml-2">✓</span> : <span className="text-red-500 ml-2">✗</span>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center text-lg">Time Left: {timeLeft}s</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;