import NavBar from "../src/Components/NavBar";
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

test("renders NavBar", () => {
  render(
    <Router>
      <NavBar />
    </Router>
  );
  const element = screen.getByText(/home/i);
  expect(element).toBeInDocument();
});
