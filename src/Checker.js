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
        width: '42px',
        margin: '4px',
        height: '42px',
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

    const handleDragStart = (event, position) => {
        const posData = JSON.stringify(position);
        event.dataTransfer.setData("text/plain", posData);
    };

    return (
        <div 
            draggable={true}
            onClick={handleClick} 
            onDragStart={(e) => handleDragStart(e, position)}
            style={checkerStyle}
        >
        </div>
    );
};

export default Checker;
