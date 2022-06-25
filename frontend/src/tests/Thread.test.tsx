import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Thread from "../components/Thread";

it("thread props test", () => {
  const status = "resolving";
  const problemName = "test thread";
  const openThread = jest.fn();
  render(
    <Thread status={status} problemName={problemName} openThread={openThread} />
  );

  const threadContainer = screen.getByTestId("thread-container");
  const threadStatus = screen.getByTestId("thread-status");

  fireEvent.click(threadContainer);
  expect(openThread).toHaveBeenCalledTimes(1);

  expect(threadStatus.className).toBe(`thread-status ${status}`);
});
