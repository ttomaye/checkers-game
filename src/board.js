import React, { useState } from 'react';
import Cell from './Cell';

const Board = () => {
    const boardSize = 8;
    const [currentPlayer, setCurrentPlayer] = useState('player1');

    const createBoard = () => {
        let board = [];
        for (let i = 0; i < boardSize; i++) {
            let row = [];
            for (let j = 0; j < boardSize; j++) {
                const isBlackCell = (i + j) % 2 !== 0;
                const player = determineCheckerPlayer(i, j, isBlackCell);
                row.push({ color: isBlackCell ? 'black' : 'white', player });
            }
            board.push(row);
        }
        return board;
    };

    const determineCheckerPlayer = (i, j, isBlackCell) => {
        if (i < 3 && isBlackCell) return 'player1';
        if (i >= 5 && isBlackCell) return 'player2';
        return null;
    };

    const handleMoveChecker = (fromRow, fromCol, toRow, toCol) => {
        setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
    };

    const initialBoard = createBoard();

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            {initialBoard.map((row, rowIndex) => (
                <div key={rowIndex} style={{display: 'flex', border: '1px solid black', width: '400px'}}>
                    {row.map((cell, cellIndex) => (
                        <Cell
                            key={cellIndex}
                            color={cell.color}
                            player={cell.player}
                            position={[rowIndex, cellIndex]}
                            onMoveChecker={handleMoveChecker}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Board;
