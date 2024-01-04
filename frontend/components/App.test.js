import React from 'react'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from './AppFunctional';

const testSquares = async (actions) => {
  for (const action of actions) {
    fireEvent.click(screen.getByText(action));

    // Wait for state changes to be reflected
    await waitFor(() => {
      const squares = screen.getAllByTestId('square');
      const activeSquareIndex = Array.from(squares).findIndex(square => square.classList.contains('active'));
      return activeSquareIndex !== -1;
    });

    const squares = screen.getAllByTestId('square');
    const activeSquareIndex = Array.from(squares).findIndex(square => square.classList.contains('active'));

    expect(activeSquareIndex).toBeGreaterThanOrEqual(0);

    const activeSquare = squares[activeSquareIndex];

    // Debugging information
    console.log(`Action: ${action}`);
    console.log(`Active Square Index: ${activeSquareIndex}`);
    console.log(`Active Square Text Content: ${activeSquare.textContent}`);

    squares.forEach((square, idx) => {
      if (idx === activeSquareIndex) {
        expect(square.textContent).toBe('B');
        expect(square).toHaveClass('active');
      } else {
        expect(square.textContent).toBeFalsy();
        expect(square).not.toHaveClass('active');
      }
    });
  }
};


test('[A2 FUNCTIONAL] Actions: up', async () => {
  render(<AppFunctional />);
  await act(async () => {
    await testSquares(['UP']);
  });
});



test('sanity', () => {
  expect(true).toBe(true);
});

test('renders text elements correctly', () => {
  render(<AppFunctional />);

  // Check if the coordinates and steps are initially rendered
  expect(screen.getByText(/Coordinates/i)).toBeInTheDocument();
  expect(screen.getByText(/You moved/i)).toBeInTheDocument();
});

test('updates input value as expected', () => {
  render(<AppFunctional />);

  // Type into the email input
  const emailInput = screen.getByPlaceholderText(/type email/i);
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

  // Check if the input value is updated
  expect(emailInput).toHaveValue('test@example.com');
});




