import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import Main from "../components/Main";
import MessageBubble from "../components/MessageBubble";

it("main props test", () => {
  const messagesEndRef = createRef();
  const bubbles = [
    <MessageBubble
      key="test-bubble"
      text="test"
      sender="message-bubble-user"
      prevSender="message-bubble-volunteer"
    />,
  ];
  render(<Main messagesEndRef={messagesEndRef} bubbles={bubbles} />);

  const dummyDiv = screen.getByTestId("dummy-div");
  expect(messagesEndRef.current).toBe(dummyDiv);
  expect(screen.getByText("test")).toBeTruthy();
});
