import React, { useEffect, useState } from 'react';

const Checker = ({ initialPlayer, onMove, position }) => {
    const [player, setPlayer] = useState(initialPlayer);
    const [isMoving, setIsMoving] = useState(false);

    useEffect(() => {
        console.log('Rendering Checker, player:', player);
    }, [player]);

    const handleClick = () => {
        setIsMoving(!isMoving);
    };

    const handleMove = (newPosition) => {
        onMove(position[0], position[1], newPosition[0], newPosition[1]);
        setIsMoving(false);
    };

    const checkerStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: player === 'player1' ? 'red' : 'blue',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const textStyle = {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: player ? 'black' : '#ccc',
    };

    return (
        <div 
            onClick={() => {
                console.log('Checker clicked. Current player:', player);
                setPlayer(player === 'player1' ? 'player2' : 'player1');
            }} 
            style={checkerStyle}
        >
        </div>
    );
};

export default Checker;
