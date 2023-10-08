import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Checkers Game heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Checkers Game/i);
  expect(headingElement).toBeInTheDocument();
});
