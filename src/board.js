import React from 'react';
import Checker from './checkers';

const Board = () => {
    const boardSize = 8;

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

    const getCheckerPlayer = (rowIndex, cellColor) => {
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
        border: '2px solid #000',
    };

    return (
        <div className="board" style={{display: 'flex', flexDirection: 'column'}}>
            {initialBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="row" style={{display: 'flex'}}>
                    {row.map((cell, cellIndex) => (
                        <div 
                            key={cellIndex} 
                            className={`cell ${cell}`} 
                            style={cell === 'white' ? whiteCellStyle : blackCellStyle}
                        >
                            {getCheckerPlayer(rowIndex, cell) &&
                                <Checker player={getCheckerPlayer(rowIndex, cell)} />
                            }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
