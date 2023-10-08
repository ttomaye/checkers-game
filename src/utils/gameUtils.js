export const calculatePossibleMoves = (row, col, initialBoard, isValidMove) => {
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

export const isCaptureMoveAvailableForChecker = (row, col, currentPlayer, boardSize, initialBoard) => {
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