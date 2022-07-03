import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ProblemSolved from "../components/ProblemSolved";

it("problem solved buttons test", () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();
  let notification = true;
  const toggleNotification = jest.fn((val: boolean) => {
    notification = val;
  });

  render(
    <ProblemSolved
      onCancel={onCancel}
      onSubmit={onSubmit}
      toggle={toggleNotification}
      active={notification}
    />
  );

  const noButton = screen.getByTestId("no-button");
  const yesButton = screen.getByTestId("yes-button");

  fireEvent.click(noButton);
  expect(onCancel).toBeCalled();
  expect(toggleNotification).toBeCalledTimes(1);
  expect(notification).toBe(false);

  fireEvent.click(yesButton);
  expect(onSubmit).toBeCalled();
  expect(toggleNotification).toBeCalledTimes(2);
});
