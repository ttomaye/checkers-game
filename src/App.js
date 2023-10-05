import React from 'react';
import Board from './board'; 
import './App.css'; 

const App = () => {
  return (
    <div className="app">
      <h1 className="text-3xl mb-4">Checkers Game</h1>
      <Board />
    </div>
  );
};

export default App;
