import React, { useState, useEffect } from 'react';
import Cell from './Cell';

const Board = () => {
    const boardSize = 8;
    const [time, setTime] = useState(0);
    const [moveCount, setMoveCount] = useState(0);
    const [gameHistory, setGameHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);

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
                row.push({ color: isBlackCell ? 'black' : 'white', player, isKing: false });
            }
            board.push(row);
        }
        return board;
    };

    const playerInfo = {
        player1: 'Red',
        player2: 'Blue',
    };

    const kingCheckerIfEligible = (board, row, col) => {
        if (
            (board[row][col].player === 'player1' && row === boardSize - 1) ||
            (board[row][col].player === 'player2' && row === 0)
        ) {
            board[row][col].isKing = true;
        }
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

    const checkForWinner = () => {
        let player1Checkers = 0;
        let player2Checkers = 0;

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (initialBoard[i][j].player === 'player1') player1Checkers++;
                if (initialBoard[i][j].player === 'player2') player2Checkers++;
            }
        }
       
        if (player1Checkers === 0) {
            setGameOver(true);
            setWinner('Player 2 (Blue)');
        } else if (player2Checkers === 0) {
            setGameOver(true);
            setWinner('Player 1 (Red)');
        }
        console.log(gameOver);
    };

    const calculatePossibleMoves = (row, col) => {
        let possibleMoves = [];
        let capturingMoves = [];

        if (initialBoard[row][col].isKing) {
            const additionalMoves = [
                [row + 1, col + 1], [row + 1, col - 1],
                [row - 1, col + 1], [row - 1, col - 1],
                [row + 2, col + 2], [row + 2, col - 2],
                [row - 2, col + 2], [row - 2, col - 2],
            ];

            additionalMoves.forEach(([newRow, newCol]) => {
                if (isValidMove(row, col, newRow, newCol)) {
                    if (Math.abs(newRow - row) === 1) {
                        possibleMoves.push([newRow, newCol]);
                    } else {
                        capturingMoves.push([newRow, newCol]);
                    }
                }
            });
        }

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
        if (gameOver) return;
        const possibleMoves = calculatePossibleMoves(row, col);
        setHighlightedCells(possibleMoves);
    };

    const handleMouseLeave = () => {
        if (gameOver) return;
        setHighlightedCells([]);
        checkForWinner();
    };

    const determineCheckerPlayer = (i, j, isBlackCell) => {
        if (i < 3 && isBlackCell) return 'player1';
        if (i >= 5 && isBlackCell) return 'player2';
        return null;
    };

    const [currentPlayer, setCurrentPlayer] = useState('player1');
    const [initialBoard, setInitialBoard] = useState(createBoard());
    const [highlightedCells, setHighlightedCells] = useState([]);

    useEffect(() => {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const { moveCount, time, gameHistory, currentPlayer, initialBoard } = JSON.parse(savedGameState);
            setMoveCount(moveCount);
            setTime(time);
            setGameHistory(gameHistory);
            setCurrentPlayer(currentPlayer);
            setInitialBoard(initialBoard);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        let timerId;
        if (!gameOver) {
            timerId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }
    
        return () => clearInterval(timerId);
    }, [gameOver]);
    
    
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('gameState', JSON.stringify({
                moveCount,
                time,
                gameHistory,
                currentPlayer,
                initialBoard
            }));
        }
    }, [moveCount, time, gameHistory, currentPlayer, initialBoard]);

    const handleMoveChecker = (fromPosition, toPosition) => {
        const [fromRow, fromCol] = fromPosition;
        const [toRow, toCol] = toPosition;

        if (gameOver) return;

        if (!isValidMove(fromRow, fromCol, toRow, toCol)) {
            console.log("Invalid move");
            return;
        }

        updateGameHistory();
        const newBoard = createNewBoard(fromRow, fromCol, toRow, toCol);
        updateBoardAndPlayer(newBoard);
        checkForWinner();
    };

    const updateGameHistory = () => {
        setGameHistory(prev => [...prev, { board: initialBoard, player: currentPlayer }]);
        setMoveCount(prevCount => prevCount + 1);
    };

    const createNewBoard = (fromRow, fromCol, toRow, toCol) => {
        let newBoard = initialBoard.map(row => [...row]);

        newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = {
            color: (fromRow + fromCol) % 2 === 0 ? 'white' : 'black',
            player: null
        };

        if (isJumpMove(fromRow, toRow)) {
            removeJumpedChecker(newBoard, fromRow, fromCol, toRow, toCol);
        }

        kingCheckerIfEligible(newBoard, toRow, toCol);

        return newBoard;
    };

    const isJumpMove = (fromRow, toRow) => Math.abs(fromRow - toRow) === 2;

    const removeJumpedChecker = (board, fromRow, fromCol, toRow, toCol) => {
        const jumpedRow = (fromRow + toRow) / 2;
        const jumpedCol = (fromCol + toCol) / 2;
        board[jumpedRow][jumpedCol] = {
            color: board[jumpedRow][jumpedCol].color,
            player: null
        };
    };

    const updateBoardAndPlayer = (newBoard) => {
        setInitialBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
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

    const restartGame = () => {
        setMoveCount(0);
        setTime(0);
        setGameHistory([]);
        setGameOver(false);
        setWinner(null);
        setInitialBoard(createBoard());
        setCurrentPlayer('player1');
    };

    const isValidMove = (fromRow, fromCol, toRow, toCol) => {

        if (
            toRow < 0 || toCol < 0 ||
            toRow >= boardSize || toCol >= boardSize ||
            initialBoard[toRow][toCol].color !== 'black'
        ) {
            return false;
        }

        const distance = Math.abs(fromRow - toRow);
        const isCaptureMove = distance === 2;

        if (isCaptureAvailable(currentPlayer) && !isCaptureMove) {
            return false;
        }

        if (
            !initialBoard[fromRow][fromCol].isKing &&
            ((currentPlayer === 'player1' && toRow <= fromRow) ||
                (currentPlayer === 'player2' && toRow >= fromRow))
        ) {
            return false;
        }

        if (distance === 1 && !isCaptureMove) {
            return initialBoard[toRow][toCol].player === null;
        }

        if (isCaptureMove) {
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
             {!gameOver && <h2 style={{ color: getTurnColor() }}>
                Checker's Turn : {playerInfo[currentPlayer]}
            </h2>}
            <div style={{ display: 'flex', flexDirection: 'row', width: '400px' }}>
                <h4 style={{ flex: '1' }}>Game Time: {formatTime(time)}</h4>
                <h4 style={{ flex: '1' }}>Moves Made: {moveCount}</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', width: '400px' }}>
                <button
                    onClick={revertLastMove}
                    style={{
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
                        color: 'white',
                        flex: '1',
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
                <button
                    onClick={restartGame}
                    style={{
                        backgroundColor: '#f20f34',
                        borderColor: '#f20f34',
                        color: 'white',
                        padding: '10px 20px',
                        textAlign: 'center',
                        flex: '1',
                        textDecoration: 'none',
                        display: 'inline-block',
                        fontSize: '16px',
                        margin: '4px 2px',
                        cursor: 'pointer',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        transition: 'all 0.3s',
                    }}
                >
                    Restart Game
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {gameOver && (
                    <h2 style={{ color: winner === 'Player 1 (Red)' ? 'red' : 'blue', fontSize: '24px', fontWeight: 'bold' }}>
                        {winner} Wins! <span style={{ color: 'black' }}>Game Over</span>
                    </h2>
                )}
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
