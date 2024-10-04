// components/TruthTable.jsx
import React from 'react';
import { Input } from "@/components/ui/input";

const TruthTable = ({ expression, userAnswers, setUserAnswers }) => {
  const rows = [...Array(16)].map((_, i) => 
    ({ A: i >> 3 & 1, B: i >> 2 & 1, C: i >> 1 & 1, D: i & 1 })
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr>
            <th>A</th><th>B</th><th>C</th><th>D</th><th>Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {['A', 'B', 'C', 'D'].map(varName => 
                <td key={varName}>{row[varName]}</td>
              )}
              <td>
                <Input 
                  value={userAnswers[idx] || ''} 
                  onChange={(e) => {
                    let newAnswers = [...userAnswers];
                    newAnswers[idx] = e.target.value;
                    setUserAnswers(newAnswers);
                  }} 
                  disabled={!expression} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TruthTable;