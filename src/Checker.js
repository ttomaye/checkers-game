import React, { useEffect, useState } from 'react';
import './Checker.css';

const Checker = ({ initialPlayer, onMove, position }) => {
    const [player, setPlayer] = useState(initialPlayer);

    useEffect(() => {
        setPlayer(initialPlayer);
    }, [initialPlayer]);

    const handleDragStart = (event, position) => {
        const posData = JSON.stringify(position);
        event.dataTransfer.setData("text/plain", posData);
    };

    return (
        <div 
            draggable
            onDragStart={(e) => handleDragStart(e, position)}
            className={`checker ${player}`}
        >
        </div>
    );
};

export default Checker;
