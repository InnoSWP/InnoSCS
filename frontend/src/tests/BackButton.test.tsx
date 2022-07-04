import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BackButton from "../components/BackButton";

it("toggle on click test", () => {
  let active = false;
  const toggle = jest.fn((value: boolean) => {
    active = value;
  });

  render(<BackButton active={active} toggle={toggle} />);
  const buttonBack = screen.getByTestId("button-back");

  fireEvent.click(buttonBack);
  expect(toggle).toBeCalledTimes(1);

  fireEvent.click(buttonBack);
  expect(toggle).toBeCalledTimes(2);
});
