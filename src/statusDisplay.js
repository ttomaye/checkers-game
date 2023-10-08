const StatusDisplay = ({ currentPlayer, gameOver, playerInfo, winner }) => {

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
            {!gameOver ? (
                <h2 style={{ color: getTurnColor() }}>
                    Checker's Turn: {playerInfo[currentPlayer]}
                </h2>
            ) : (
                <h2>
                    <p style={{ color: winner}}> Winner is:  {winner}</p>
                </h2>
            )}
        </div>
    );
};

export default StatusDisplay;
