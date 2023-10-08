import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BoardDisplay from './BoardDisplay';

test('renders board cells correctly', () => {
    const initialBoard = [
        [null, { color: 'red', player: 1 }, null, { color: 'black', player: 2 }],
        [{ color: 'black', player: 2 }, null, { color: 'red', player: 1 }, null]
    ];

    const { getAllByTestId } = render(
        <BoardDisplay 
            initialBoard={initialBoard}
            handleMoveChecker={jest.fn()}
            handleMouseEnter={jest.fn()}
            handleMouseLeave={jest.fn()}
            highlightedCells={[]}
        />
    );
    expect(getAllByTestId('cell').length).toBe(4);
});

test('calls handleMouseEnter and handleMouseLeave when mouse enters/leaves a cell', () => {
    const initialBoard = [
        [null, { color: 'red', player: 1 }]
    ];
    const handleMoveChecker = jest.fn();
    const handleMouseEnter = jest.fn();
    const handleMouseLeave = jest.fn();

    const { getByTestId } = render(
        <BoardDisplay 
            initialBoard={initialBoard}
            handleMoveChecker={handleMoveChecker}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            highlightedCells={[]}
        />
    );

    fireEvent.mouseOver(getByTestId('cell'));
    expect(handleMouseEnter).toHaveBeenCalled();

    fireEvent.mouseOut(getByTestId('cell'));
    expect(handleMouseLeave).toHaveBeenCalled();
});
