import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Notifications from '../src/pages/Notifications';
test('renders Notifications', () => {
  render(<Notifications/>)
  const element = screen.getByText(/notifications/i); // Replace 
  expect(element).toBeInTheDocument();
});