import { useState, useEffect } from 'react';

const useGameLogic = ({currentPlayer, setCurrentPlayer, boardSize}) => {

    const determineCheckerPlayer = (i, j, isBlackCell) => {
        if (i < 3 && isBlackCell) return 'player1';
        if (i >= 5 && isBlackCell) return 'player2';
        return null;
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

    const [time, setTime] = useState(0);
    const [moveCount, setMoveCount] = useState(0);
    const [gameHistory, setGameHistory] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [player1Checkers, setPlayer1Checkers] = useState(12);
    const [player2Checkers, setPlayer2Checkers] = useState(12);
    const [initialBoard, setInitialBoard] = useState(createBoard(boardSize));
    const [highlightedCells, setHighlightedCells] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkForWinner = () => {
            if (player1Checkers === 0) {
                setGameOver(true);
                setWinner('Red');
            } else if (player2Checkers === 0) {
                setGameOver(true);
                setWinner('Blue');
            }
        };

        checkForWinner();
    }, [player1Checkers, player2Checkers]);

    useEffect(() => {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const { 
                moveCount, time, 
                gameHistory, currentPlayer, 
                initialBoard 
            } = JSON.parse(savedGameState);
            
            setMoveCount(moveCount);
            setTime(time);
            setGameHistory(gameHistory);
            setCurrentPlayer(currentPlayer);
            setInitialBoard(initialBoard);
        }
        setLoading(false);
    }, []);    

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

    useEffect(() => {
        let timerId;
        if (!gameOver) {
            timerId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(timerId);
    }, [gameOver]);

    const restartGame = () => {
        setMoveCount(0);
        setTime(0);
        setGameHistory([]);
        setGameOver(false);
        setWinner(null);
        setPlayer1Checkers(12);
        setPlayer2Checkers(12);
        setInitialBoard(createBoard(boardSize));
        setCurrentPlayer('player1');
    };

    return {
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
        currentPlayer,
        setCurrentPlayer,
        initialBoard,
        setInitialBoard,
        highlightedCells,
        setHighlightedCells,
        restartGame,
    };
};

export default useGameLogic;
