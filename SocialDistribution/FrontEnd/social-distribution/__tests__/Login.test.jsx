
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Login from '../src/pages/Login';
test('renders Login', () => {
    render(<Login/>)
    const element = screen.getByText(/sign in/i);
    expect(element).toBeInDocument();
})