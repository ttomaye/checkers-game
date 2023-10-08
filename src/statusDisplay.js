const StatusDisplay = ({ currentPlayer, time, moveCount, gameOver, playerInfo }) => {

    const playerColors = {
        player1: 'Red',
        player2: 'Blue',
    };

    const getTurnColor = () => {
        if (playerColors[currentPlayer] === 'Red') return 'red';
        if (playerColors[currentPlayer] === 'Blue') return 'blue';
        return 'black';
    };

    return (
        <div>
            {!gameOver && 
                <h2 style={{ color: getTurnColor() }}>
                    Checker's Turn : {playerInfo[currentPlayer]}
                </h2>
            }
        </div>
    );
};

export default StatusDisplay;
