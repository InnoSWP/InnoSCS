import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Notification from "../components/Notification";
import ProblemSolved from "../components/ProblemSolved";

it("toggleNotification test", () => {
  const toggleNotification = jest.fn((value: boolean) => {
    active = value;
  });
  var active = true;
  render(
    <Notification
      id="test-id"
      active={active}
      blur={true}
      toggleNotification={toggleNotification}
    >
      <ProblemSolved
        onCancel={() => {
          // mock
        }}
        onSubmit={() => {
          // mock
        }}
      />
    </Notification>
  );
  const notificationContainer = screen.getByTestId("notification-container");
  expect(notificationContainer.className).toBe(
    "notification-container activated"
  );

  const modalContainer = screen.getByTestId("modal-container");
  expect(modalContainer.style.visibility).toBe("visible");
  expect(modalContainer.classList.contains("blurred")).toBeTruthy();
  fireEvent.click(modalContainer);
  expect(toggleNotification).toHaveBeenCalled();
  expect(modalContainer.classList.contains("blurred")).not.toBeTruthy();
});

it("onTransitionEnd test", async () => {
  const toggleNotification = jest.fn((value: boolean) => {
    active = value;
  });

  Notification.prototype.toggleModal = jest.fn(
    Notification.prototype.toggleModal
  );
  let active = true;
  render(
    <Notification
      id="test-id"
      active={active}
      blur={true}
      toggleNotification={toggleNotification}
    >
      <ProblemSolved
        onCancel={() => {
          // mock
        }}
        onSubmit={() => {
          // mock
        }}
      />
    </Notification>
  );

  const notificationContainer = screen.getByTestId("notification-container");
  const modalContainer = screen.getByTestId("modal-container");
  fireEvent.click(modalContainer);
  setTimeout(() => {
    expect(notificationContainer.className).toBe("notification-container ");
  }, 1000);
});
