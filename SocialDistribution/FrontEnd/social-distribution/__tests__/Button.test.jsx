import Button from '../src/Components/Button';
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

test('render button', () => {
    render(<Button>Test</Button>)
    const element = screen.getByText(/test/i)
    expect(element).toBeInTheDocument()
})