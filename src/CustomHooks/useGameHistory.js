import { useState } from 'react';

const useGameHistory = ({currentPlayer, setMoveCount, initialBoard}) => {
    const [gameHistory, setGameHistory] = useState([]);
    const [currentBoard, setCurrentBoard] = useState(initialBoard);

    const updateGameHistory = () => {
        setGameHistory(prev => [...prev, { board: initialBoard, player: currentPlayer }]);
        setMoveCount(prevCount => prevCount + 1);
    };

    return {
        gameHistory,
        currentBoard,
        updateGameHistory
    };
};

export default useGameHistory;
