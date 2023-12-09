import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Account from '../src/pages/Account';
test('renders Account', () => {
    render(<Account/>)
    const element = screen.getByText(/profile/i);
    expect(element).toBeInDocument();
})