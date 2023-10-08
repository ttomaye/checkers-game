import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GameInfo from './GameInfo';

describe('GameInfo Component', () => {
  
  test('renders correctly with time and move count', () => {
    const mockFormatTime = jest.fn();
    mockFormatTime.mockReturnValue("00:10");

    render(<GameInfo time={10} moveCount={5} formatTime={mockFormatTime} />);

    expect(mockFormatTime).toHaveBeenCalledWith(10);
    expect(screen.getByText("Game Time: 00:10")).toBeInTheDocument();
    expect(screen.getByText("Moves Made: 5")).toBeInTheDocument();
  });

  test('renders correctly with different time and move count', () => {
    const mockFormatTime = jest.fn();
    mockFormatTime.mockReturnValue("00:20");

    render(<GameInfo time={20} moveCount={10} formatTime={mockFormatTime} />);

    expect(mockFormatTime).toHaveBeenCalledWith(20);
    expect(screen.getByText("Game Time: 00:20")).toBeInTheDocument();
    expect(screen.getByText("Moves Made: 10")).toBeInTheDocument();
  });
});
