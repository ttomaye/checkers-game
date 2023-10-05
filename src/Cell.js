import React from 'react';
import Checker from './Checker';

const Cell = ({ color, player, position, onDropChecker, onMouseEnter, onMouseLeave, highlightedCells }) => {
    const [row, col] = position;
    const isHighlighted = highlightedCells.some(([hRow, hCol]) => hRow === row && hCol === col);
    
    const cellStyle = {
        width: '50px',
        height: '50px',
        backgroundColor: isHighlighted ? 'highlightedColor' : color,
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
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDrop={handleDrop}
        >
            {player && <Checker initialPlayer={player} player={player} position={position}/>}
        </div>
    );
};

export default Cell;
