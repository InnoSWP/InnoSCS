import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";

it("toggle menu popup test", () => {
  const toggleProblemSolved = jest.fn();
  render(<Navbar toggleProblemSolved={toggleProblemSolved} children={<></>} />);

  const buttonMenu = screen.getByTestId("button-menu");
  const popupWrapper = screen.getByTestId("popup-wrapper");
  const menuOptions = screen.getAllByTestId("menu-option");

  fireEvent.click(buttonMenu);
  expect(popupWrapper.classList.contains("activated")).toBeTruthy();

  for (let i = 0; i < menuOptions.length; i++) {
    fireEvent.click(menuOptions[i]);
  }

  expect(toggleProblemSolved).toBeCalled();
});
