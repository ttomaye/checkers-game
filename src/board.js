import React, { useState, useEffect } from 'react';
import Cell from './Cell';

const Board = () => {
    const boardSize = 8;
    const [time, setTime] = useState(0);
    const [moveCount, setMoveCount] = useState(0);
    const [gameHistory, setGameHistory] = useState([]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

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

    const playerInfo = {
        player1: 'Red',
        player2: 'Blue',
    };

    const isCaptureMoveAvailableForChecker = (row, col) => {
        const directions = currentPlayer === 'player1' ? [[2, 2], [2, -2]] : [[-2, -2], [-2, 2]];

        return directions.some(([dx, dy]) => {
            const midRow = row + dx / 2;
            const midCol = col + dy / 2;
            const destRow = row + dx;
            const destCol = col + dy;

            if (destRow < 0 || destRow >= boardSize || destCol < 0 || destCol >= boardSize) {
                return false;
            }

            return initialBoard[midRow][midCol]?.player &&
                initialBoard[midRow][midCol].player !== currentPlayer &&
                !initialBoard[destRow][destCol].player;
        });
    };

    const isCaptureAvailable = (player) => {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (initialBoard[i][j].player === player) {
                    if (isCaptureMoveAvailableForChecker(i, j)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const calculatePossibleMoves = (row, col) => {
        let possibleMoves = [];
        let capturingMoves = [];

        if (initialBoard[row][col].player === 'player1') {

            if (isValidMove(row, col, row + 2, col - 2)) capturingMoves.push([row + 2, col - 2]);
            if (isValidMove(row, col, row + 2, col + 2)) capturingMoves.push([row + 2, col + 2]);

            if (isValidMove(row, col, row + 1, col - 1)) possibleMoves.push([row + 1, col - 1]);
            if (isValidMove(row, col, row + 1, col + 1)) possibleMoves.push([row + 1, col + 1]);
        }

        if (initialBoard[row][col].player === 'player2') {

            if (isValidMove(row, col, row - 2, col - 2)) capturingMoves.push([row - 2, col - 2]);
            if (isValidMove(row, col, row - 2, col + 2)) capturingMoves.push([row - 2, col + 2]);

            if (isValidMove(row, col, row - 1, col - 1)) possibleMoves.push([row - 1, col - 1]);
            if (isValidMove(row, col, row - 1, col + 1)) possibleMoves.push([row - 1, col + 1]);
        }

        if (capturingMoves.length > 0) {
            return capturingMoves;
        }

        return possibleMoves;
    };


    const handleMouseEnter = (row, col) => {
        const possibleMoves = calculatePossibleMoves(row, col);
        setHighlightedCells(possibleMoves);
    };

    const handleMouseLeave = () => {
        setHighlightedCells([]);
    };

    const determineCheckerPlayer = (i, j, isBlackCell) => {
        if (i < 3 && isBlackCell) return 'player1';
        if (i >= 5 && isBlackCell) return 'player2';
        return null;
    };

    const [currentPlayer, setCurrentPlayer] = useState('player1');
    const [initialBoard, setInitialBoard] = useState(createBoard());
    const [highlightedCells, setHighlightedCells] = useState([]);

    const handleMoveChecker = (fromPosition, toPosition) => {
        const [fromRow, fromCol] = fromPosition;
        const [toRow, toCol] = toPosition;

        if (isValidMove(fromRow, fromCol, toRow, toCol)) {
            setGameHistory(prev => [...prev, { board: initialBoard, player: currentPlayer }]);
            let newBoard = [...initialBoard];
            setMoveCount((prevCount) => prevCount + 1);
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

    const revertLastMove = () => {
        if (gameHistory.length === 0) {
            console.log("No moves to revert!");
            return;
        }

        const lastHistory = gameHistory.pop();
        setInitialBoard(lastHistory.board);
        setCurrentPlayer(lastHistory.player);
    };

    const getTurnColor = () => {
        if (playerInfo[currentPlayer] === 'Red') return 'red';
        if (playerInfo[currentPlayer] === 'Blue') return 'blue';
        return 'black';
    };

    const isValidMove = (fromRow, fromCol, toRow, toCol) => {
        if (toRow < 0 || toCol < 0 || toRow >= boardSize || toCol >= boardSize) {
            return false;
        }

        const distance = Math.abs(fromRow - toRow);
        const isCaptureMove = distance === 2;

        if (isCaptureAvailable(currentPlayer) && !isCaptureMove) {
            return false;
        }

        if (currentPlayer === 'player1' && toRow <= fromRow) {
            return false;
        } else if (currentPlayer === 'player2' && toRow >= fromRow) {
            return false;
        }

        if (distance === 1 && !isCaptureMove) {
            return initialBoard[toRow][toCol].player === null;
        }

        else if (isCaptureMove) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;

            return (
                initialBoard[midRow][midCol]?.player !== currentPlayer &&
                initialBoard[midRow][midCol]?.player !== null &&
                initialBoard[toRow][toCol].player === null
            );
        }

        return false;
    };

    return (
        <div style={{ textAlign: 'left' }}>
            <h2 style={{ color: getTurnColor() }}>
                Checker's Turn : {playerInfo[currentPlayer]}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'row', width: '400px' }}>
                <h4 style={{ flex: '1' }}>Game Time: {formatTime(time)}</h4>
                <h4 style={{ flex: '1' }}>Moves Made: {moveCount}</h4>
            </div>
            <button
                onClick={revertLastMove}
                style={{
                    backgroundColor: '#4CAF50', 
                    borderColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    margin: '4px 2px',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    marginBottom: '20px', 
                    transition: 'all 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
            >
                Revert Last Move
            </button>

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
                                    onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
                                    onMouseLeave={handleMouseLeave}
                                    highlightedCells={highlightedCells}
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
        </div>
    );
};

export default Board;
