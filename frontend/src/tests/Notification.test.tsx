import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import ProblemSolved from "../components/ProblemSolved";

it("toggleNotification test", () => {
  const toggleNotification = jest.fn((value: boolean) => {
    active = value;
  });
  var active = true;
  render(
    <ProblemSolved
      toggle={toggleNotification}
      active={active}
      onCancel={() => {
        // mock
      }}
      onSubmit={() => {
        // mock
      }}
    />
  );
});

// it("onTransitionEnd test", async () => {
//   const toggleNotification = jest.fn((value: boolean) => {
//     active = value;
//   });

//   Notification.prototype.toggleModal = jest.fn(
//     Notification.prototype.toggleModal
//   );
//   let active = true;
//   render(
//     <ProblemSolved
//       toggle={toggleNotification}
//       active={active}
//       onCancel={() => {
//         // mock
//       }}
//       onSubmit={() => {
//         // mock
//       }}
//     />
//   );

//   const notificationContainer = screen.getByTestId("notification-container");
//   const modalContainer = screen.getByTestId("modal-container");
//   fireEvent.click(modalContainer);
// });
