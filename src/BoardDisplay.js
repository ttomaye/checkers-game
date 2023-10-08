import React from 'react';
import Cell from './Cell';
import './App.css';

const BoardDisplay = ({ 
    initialBoard, 
    handleMoveChecker, 
    handleMouseEnter, 
    handleMouseLeave, 
    highlightedCells 
}) => {
    return (
        <div className="flex-column">
            {initialBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex-row row-border width-400">
                    {row.map((cell, cellIndex) => (
                        cell ? (
                            <Cell
                                key={cellIndex}
                                color={cell.color}
                                player={cell.player}
                                position={[rowIndex, cellIndex]}
                                onDropChecker={handleMoveChecker}
                                onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
                                onMouseLeave={handleMouseLeave}
                                highlightedCells={highlightedCells}
                            />
                        ) : (
                            <div
                                key={cellIndex}
                                className={(rowIndex + cellIndex) % 2 === 0 ? 'cell-empty-white' : 'cell-empty-black'}
                            />
                        )
                    ))}
                </div>
            ))}
        </div>
    );
};

export default BoardDisplay;
