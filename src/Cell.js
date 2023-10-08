import React from 'react';
import Checker from './Checker';
import './Cell.css'; 

const Cell = ({ color, player, position, onDropChecker, onMouseEnter, onMouseLeave, highlightedCells }) => {
    const [row, col] = position;
    const highlightedColor = 'yellow';
    const isHighlighted = highlightedCells.some(([hRow, hCol]) => hRow === row && hCol === col);

   
    const dynamicStyles = {
        backgroundColor: isHighlighted ? highlightedColor : color,
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
            style={dynamicStyles}
            className="cell" 
            onDragOver={handleDragOver}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDrop={handleDrop}
            data-testid="cell"
        >
            {player && <Checker initialPlayer={player} player={player} position={position}/>}
        </div>
    );
};

export default Cell;
