// components/ExpressionDisplay.jsx
import React from 'react';

const ExpressionDisplay = ({ expression }) => (
  <div className="mb-4 text-center">
    <p className="text-xl">Expression: {expression}</p>
  </div>
);

export default ExpressionDisplay;