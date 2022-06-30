import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SubmitProblem from "../components/SubmitProblem";

it("submit problem props and input test", async () => {
  let testText = "something";
  const changeText = jest.fn((value: string) => {
    testText = value;
  });
  const submitThread = jest.fn();
  const toggleNotification = jest.fn();

  render(
    <SubmitProblem
      changeText={changeText}
      inputText={testText}
      submitThread={submitThread}
      toggleNotification={toggleNotification}
    />
  );

  const submitButton = screen.getByTestId("submit-button");
  const SubmitProblemInput: HTMLInputElement = screen.getByTestId(
    "submit-problem-input"
  );

  expect(SubmitProblemInput.value).toBe("something");

  fireEvent.change(SubmitProblemInput, { target: { value: "testing" } });
  expect(changeText).toBeCalledWith("testing");
  expect(testText).toBe("testing");

  fireEvent.click(submitButton);
  expect(submitThread).toHaveBeenCalledTimes(1);
  expect(toggleNotification).toHaveBeenCalledTimes(1);
});
