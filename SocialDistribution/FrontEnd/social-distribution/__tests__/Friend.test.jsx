
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Friends from '../src/pages/Friends';
test('renders Friends Page', () => {
  render(<Friends/>);
  const element = screen.getByText(/My Friends/i); // Replace 
  expect(element).toBeInTheDocument();
});