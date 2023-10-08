import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Checker from './Checker';

test('renders Checker component without crashing', () => {
    render(<Checker initialPlayer="player1" position={[0, 0]} />);
});

test('has correct player class', () => {
    const { container } = render(<Checker initialPlayer="player1" position={[0, 0]} />);
    const checkerDiv = container.querySelector('.checker');
    expect(checkerDiv).toHaveClass('player1');
});

test('sets drag data correctly', () => {
    const { getByTestId } = render(<Checker initialPlayer="player1" position={[0, 0]} />);
    
    const mockDragEvent = createMockDragEvent();
    const checkerDiv = getByTestId('checker');
    
    fireEvent.dragStart(checkerDiv, mockDragEvent);
    
    expect(mockDragEvent.dataTransfer.setData).toHaveBeenCalledWith("text/plain", JSON.stringify([0, 0]));
});

function createMockDragEvent() {
    return {
        dataTransfer: {
            setData: jest.fn(),
        },
    };
}
