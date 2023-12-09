import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '../src/pages/Home';
test('renders HomePage', () => {
  render(<Home/>);
  const element = screen.getByText(/select field/i); // Replace 
  expect(element).toBeInTheDocument();
});