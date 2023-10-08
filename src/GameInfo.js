import React from 'react';

const GameInfo = ({ time, moveCount, formatTime }) => {
    return (
        <div className="flex-row width-400">
            <h4 className="flex-1">Game Time: {formatTime(time)}</h4>
            <h4 className="flex-1">Moves Made: {moveCount}</h4>
        </div>
    );
};

export default GameInfo;
