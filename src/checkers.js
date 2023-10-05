import React, { useEffect, useState } from 'react';

const Checker = () => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    console.log('Rendering Checker, player:', player);
  }, [player]);

  const handleClick = () => {
    setPlayer(prevPlayer => 
      prevPlayer === null ? 'player1' : 
      prevPlayer === 'player1' ? 'player2' : 
      null
    );
  }

  const style = {
    cursor: 'pointer',
    padding: '16px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    textAlign: 'center',
    transition: 'border-color 300ms ease-in-out',
  };

  const hoverStyle = {
    ...style,
    borderColor: '#00f',
  };

  const textStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: player ? 'black' : '#ccc',
  };

  return (
    <div 
      onClick={handleClick} 
      style={player === 'player2' ? hoverStyle : style}
      onMouseEnter={() => {
        if(player === 'player1') {
          setPlayer('player2');
        }
      }}
      onMouseLeave={() => {
        if(player === 'player2') {
          setPlayer('player1');
        }
      }}
    >
      <p style={textStyle}>
        {player ? `Current Player is: ${player}` : ''}
      </p>
    </div>
  );
};

export default Checker;
