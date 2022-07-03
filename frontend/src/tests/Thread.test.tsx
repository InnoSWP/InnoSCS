import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Thread from "../components/Thread";
import { RecoilRoot } from "recoil";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

it("thread props test", async () => {
  jest.useFakeTimers();
  const status = "resolving";
  const problemName = "test thread";
  const openThread = jest.fn();
  const { rerender } = render(
    <RecoilRoot>
      <Thread
        status={status}
        problemName={problemName}
        openThread={openThread}
      />
    </RecoilRoot>
  );

  const threadContainer = screen.getByTestId("thread-container");
  const threadStatus = screen.getByTestId("thread-status");
  const threadCheckbox: HTMLInputElement =
    screen.getByTestId("thread-checkbox");

  fireEvent.click(threadContainer);

  fireEvent.click(threadCheckbox);
  await act(async () => {
    jest.runOnlyPendingTimers();
  });
  fireEvent.click(threadCheckbox);

  expect(openThread).toHaveBeenCalledTimes(1);

  expect(threadStatus.className).toBe(`thread-status ${status}`);
});
