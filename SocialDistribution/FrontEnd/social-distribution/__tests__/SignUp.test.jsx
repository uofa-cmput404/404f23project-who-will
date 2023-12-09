import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SignUp from '../src/pages/SignUp';
test('renders SignUp', () => {
    render(<SignUp/>);
    const element = screen.getByText(/Sign Up/i);
    expect(element).toBeInDocument();
})