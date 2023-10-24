import React, { useState } from 'react';
import StatusDisplay from './statusDisplay';
import ActionButtons from './ActionButtons';
import BoardDisplay from './BoardDisplay';
import useGameLogic from './CustomHooks/useGameLogic';
import useGameHistory from './CustomHooks/useGameHistory';
import { calculatePossibleMoves, isCaptureMoveAvailableForChecker } from './utils/gameUtils';
import GameInfo from './GameInfo';
import './App.css';

const Board = () => {
    const boardSize = 8;
    const initialPlayer = 'player1';
    const [currentPlayer, setCurrentPlayer] = useState(initialPlayer);
    const {
        time,
        setTime,
        moveCount,
        setMoveCount,
        gameHistory,
        setGameHistory,
        gameOver,
        setGameOver,
        winner,
        setWinner,
        player1Checkers,
        setPlayer1Checkers,
        player2Checkers,
        setPlayer2Checkers,
        initialBoard,
        setInitialBoard,
        highlightedCells,
        setHighlightedCells,
        restartGame,
    } = useGameLogic({currentPlayer, setCurrentPlayer, boardSize});

    const {
        currentBoard,  
        updateGameHistory, 
    } = useGameHistory({currentPlayer, setCurrentPlayer, moveCount, setMoveCount, initialBoard, initialPlayer});    

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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

    const isCaptureAvailable = (player) => {
        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                if (initialBoard[i][j].player === player) {
                    if (isCaptureMoveAvailableForChecker(i, j, currentPlayer, boardSize, initialBoard)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const handleMouseEnter = (row, col) => {
        if (gameOver) return;
        const possibleMoves = calculatePossibleMoves(row, col, initialBoard, isValidMove);
        setHighlightedCells(possibleMoves);
    };

    const handleMouseLeave = () => {
        if (gameOver) return;
        setHighlightedCells([]);
    };

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
        const jumpedCheckerPlayer = board[jumpedRow][jumpedCol].player;

        board[jumpedRow][jumpedCol] = {
            color: board[jumpedRow][jumpedCol].color,
            player: null
        };
        if (jumpedCheckerPlayer === 'player1') {
            setPlayer2Checkers(prev => prev - 1);
        } else if (jumpedCheckerPlayer === 'player2') {
            setPlayer1Checkers(prev => prev - 1);
        }
    };

    const updateBoardAndPlayer = (newBoard) => {
        setInitialBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'player1' ? 'player2' : 'player1');
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
        <div className="text-left">
            <StatusDisplay currentPlayer={currentPlayer} time={time} gameOver={gameOver} playerInfo={playerInfo} winner={winner} />
            <GameInfo time={time} moveCount={moveCount} formatTime={formatTime} />
            <ActionButtons restartGame={restartGame} />
            <BoardDisplay 
                initialBoard={initialBoard} 
                handleMoveChecker={handleMoveChecker} 
                handleMouseEnter={handleMouseEnter} 
                handleMouseLeave={handleMouseLeave} 
                highlightedCells={highlightedCells} 
            />
        </div>
    );
};

export default Board;
