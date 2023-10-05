import React, { useState } from 'react';
import Checker from './checkers';

const Board = () => {
    const boardSize = 8;
    const [currentPlayer, setCurrentPlayer] = useState('player1');

    const createBoard = () => {
        let board = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                row.push((i + j) % 2 === 0 ? "white" : "black");
            }
            board.push(row);
        }
        return board;
    };

    const handleMove = (fromRow, fromCol, toRow, toCol) => {
        setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
    };

    const getCheckerPlayer = (rowIndex, cellColor) => {
        console.log('getCheckerPlayer', rowIndex, cellColor);
        if (rowIndex < 3 && cellColor === 'black') {
            return 'player1';
        } else if (rowIndex >= 5 && cellColor === 'black') {
            return 'player2';
        }
        return null;
    };
    
    const initialBoard = createBoard();

    const blackCellStyle = {
        backgroundColor: 'black',
        width: '50px',
        height: '50px',
        display: 'inline-block',
    };

    const whiteCellStyle = {
        ...blackCellStyle,
        backgroundColor: 'white',
    };

    return (
        <div className="board" style={{display: 'flex', flexDirection: 'column'}}>
            {initialBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="row" style={{display: 'flex', width: '400px', border: '1px solid black'}}>
                    {row.map((cell, cellIndex) => (
                        <div 
                            key={cellIndex} 
                            className={`cell ${cell}`} 
                            style={cell === 'white' ? whiteCellStyle : blackCellStyle}
                        >
                            {getCheckerPlayer(rowIndex, cell) &&
                                <Checker 
                                    initialPlayer={getCheckerPlayer(rowIndex, cell)}
                                    player={getCheckerPlayer(rowIndex, cell)} 
                                    onMove={handleMove}
                                    position={[rowIndex, cellIndex]}
                                />
                            }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
