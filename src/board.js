import React, { useState } from 'react';
import Cell from './Cell';

const Board = () => {
    const boardSize = 8;

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

    const [currentPlayer, setCurrentPlayer] = useState('player1');
    const [initialBoard, setInitialBoard] = useState(createBoard());

    const handleMoveChecker = (fromPosition, toPosition) => {
        const [fromRow, fromCol] = fromPosition;
        const [toRow, toCol] = toPosition;
    
        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
            let newBoard = [...initialBoard];
            for (let i = 0; i < newBoard.length; i++) {
                newBoard[i] = [...newBoard[i]];
            }
    
            newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
            newBoard[fromRow][fromCol] = { color: (fromRow + fromCol) % 2 === 0 ? 'white' : 'black', player: null };
    
            if (Math.abs(fromRow - toRow) === 2) {
                const jumpedRow = (fromRow + toRow) / 2;
                const jumpedCol = (fromCol + toCol) / 2;
                newBoard[jumpedRow][jumpedCol] = { color: newBoard[jumpedRow][jumpedCol].color, player: null };
            }
    
            setInitialBoard(newBoard);
            setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
        } else {
            console.log("Invalid move");
        }
    };
    
    const isValidMove = (fromRow, fromCol, toRow, toCol) => {
        const distance = Math.abs(fromRow - toRow);
        
        if (currentPlayer === 'player1' && toRow > fromRow) {
            if (distance === 1) {
                return true;
            } else if (distance === 2) {
                return initialBoard[(fromRow + toRow) / 2][(fromCol + toCol) / 2].player === 'player2';
            }
        } else if (currentPlayer === 'player2' && toRow < fromRow) {
            if (distance === 1) {
                return true;
            } else if (distance === 2) {
                return initialBoard[(fromRow + toRow) / 2][(fromCol + toCol) / 2].player === 'player1';
            }
        }
    
        return false;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {initialBoard.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex', border: '1px solid black', width: '400px' }}>
                    {row.map((cell, cellIndex) => (
                        cell ? (
                            <Cell
                                key={cellIndex}
                                color={cell.color}
                                player={cell.player}
                                position={[rowIndex, cellIndex]}
                                onDropChecker={handleMoveChecker}
                            />
                        ) : (
                            <div
                                key={cellIndex}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: (rowIndex + cellIndex) % 2 === 0 ? 'white' : 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            />
                        )
                    ))}

                </div>
            ))}
        </div>
    );
};

export default Board;
