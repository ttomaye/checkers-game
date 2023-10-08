import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Cell from './Cell';

jest.mock('./Checker', () => (props) => (
  <div data-testid="checker">Mock Checker</div>
));

describe('Cell Component', () => {
  let mockOnDropChecker, mockOnMouseEnter, mockOnMouseLeave;

  beforeEach(() => {
    mockOnDropChecker = jest.fn();
    mockOnMouseEnter = jest.fn();
    mockOnMouseLeave = jest.fn();
  });

  test('renders with correct color and no Checker if player is not provided', () => {
    render(
      <Cell 
        color="red" 
        position={[0, 0]} 
        highlightedCells={[]} 
      />
    );

    expect(screen.getByTestId('cell')).toHaveStyle({ backgroundColor: 'red' });
    expect(screen.queryByTestId('checker')).not.toBeInTheDocument();
  });

  test('renders with Checker if player is provided', () => {
    render(
      <Cell 
        color="red" 
        player="player1" 
        position={[0, 0]} 
        highlightedCells={[]} 
      />
    );

    expect(screen.getByTestId('checker')).toBeInTheDocument();
  });

  test('renders with highlighted color if position is in highlightedCells', () => {
    render(
      <Cell 
        color="red" 
        position={[0, 0]} 
        highlightedCells={[[0, 0]]}
      />
    );

    expect(screen.getByTestId('cell')).toHaveStyle({ backgroundColor: 'yellow' });
  });

  test('calls onDropChecker with correct arguments on drop', () => {
    render(
      <Cell 
        color="red" 
        position={[0, 0]} 
        highlightedCells={[]}
        onDropChecker={mockOnDropChecker}
      />
    );

    fireEvent.drop(screen.getByTestId('cell'), { 
      dataTransfer: { getData: () => JSON.stringify([1, 1]) } 
    });

    expect(mockOnDropChecker).toHaveBeenCalledWith([1, 1], [0, 0]);
  });

  test('calls onMouseEnter and onMouseLeave on mouse enter and leave', () => {
    render(
      <Cell 
        color="red" 
        position={[0, 0]} 
        highlightedCells={[]}
        onMouseEnter={mockOnMouseEnter}
        onMouseLeave={mockOnMouseLeave}
      />
    );

    fireEvent.mouseEnter(screen.getByTestId('cell'));
    expect(mockOnMouseEnter).toHaveBeenCalled();

    fireEvent.mouseLeave(screen.getByTestId('cell'));
    expect(mockOnMouseLeave).toHaveBeenCalled();
  });
});
