import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BackButton from "../components/BackButton";

it("toggle on click test", () => {
  let active = false;
  const toggle = jest.fn((func: (val: boolean) => boolean) => {
    active = func(active);
  });

  const { rerender } = render(<BackButton active={active} toggle={toggle} />);
  const buttonBack = screen.getByTestId("button-back");

  fireEvent.click(buttonBack);
  expect(active).toBe(true);
  expect(toggle).toBeCalledTimes(1);

  rerender(<BackButton active={active} toggle={toggle} />);
  expect(buttonBack.className).toBe("button-back rotated");

  fireEvent.click(buttonBack);
  expect(active).toBe(false);
  expect(toggle).toBeCalledTimes(2);

  rerender(<BackButton active={active} toggle={toggle} />);
  expect(buttonBack.className).toBe("button-back");
});
