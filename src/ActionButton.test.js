import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ActionButtons from './ActionButtons';

describe('ActionButtons Component', () => {
    let revertLastMoveMock;
    let restartGameMock;

    beforeEach(() => {
        revertLastMoveMock = jest.fn();
        restartGameMock = jest.fn();

        render(<ActionButtons revertLastMove={revertLastMoveMock} restartGame={restartGameMock} />);
    });

    it('renders two buttons', () => {
        expect(screen.getByText('Revert Last Move')).toBeInTheDocument();
        expect(screen.getByText('Restart Game')).toBeInTheDocument();
    });

    it('calls revertLastMove function when Revert Last Move button is clicked', () => {
        userEvent.click(screen.getByText('Revert Last Move'));
        expect(revertLastMoveMock).toHaveBeenCalled();
    });

    it('calls restartGame function when Restart Game button is clicked', () => {
        userEvent.click(screen.getByText('Restart Game'));
        expect(restartGameMock).toHaveBeenCalled();
    });
});
