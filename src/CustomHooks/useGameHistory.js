import { useState } from 'react';

const useGameHistory = ({currentPlayer, setCurrentPlayer, moveCount, setMoveCount, initialBoard, initialPlayer}) => {
    const [gameHistory, setGameHistory] = useState([]);
    const [currentBoard, setCurrentBoard] = useState(initialBoard);

    const updateGameHistory = () => {
        setGameHistory(prev => [...prev, { board: initialBoard, player: currentPlayer }]);
        setMoveCount(prevCount => prevCount + 1);
    };

    const revertLastMove = () => {
        if (gameHistory.length === 0) {
            console.log("No moves to revert!");
            return;
        }
        const lastHistory = gameHistory.pop();
        setCurrentBoard(lastHistory.board);
        setCurrentPlayer(lastHistory.player);
    };

    return {
        gameHistory,
        currentBoard,
        updateGameHistory,
        revertLastMove,
    };
};

export default useGameHistory;
