import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ComposeModal from '../src/Components/Compose';
test('renders ComposeModal', () => {
  render(<ComposeModal/>);
  const element = screen.getByText(/Send Post to A Friend/i); // Replace 
  expect(element).toBeInTheDocument();
});