import React from 'react';
import Checker from './Checker';

const Cell = ({ color, player, position, onDropChecker }) => {
    const cellStyle = {
        width: '50px',
        height: '50px',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedPosition = JSON.parse(event.dataTransfer.getData("text/plain"));
        onDropChecker(droppedPosition, position);
    };

    return (
        <div 
            style={cellStyle}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {player && <Checker initialPlayer={player} player={player} position={position}/>}
        </div>
    );
};

export default Cell;
