import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import MessageBubble from "../components/MessageBubble";

afterEach(cleanup);

it("margin test different types", () => {
  render(
    <MessageBubble
      text={"test"}
      prevSender={"message-bubble-user"}
      sender={"message-bubble-volunteer"}
    />
  );
  const messageBubble = screen.getByTestId("message-bubble");
  expect(messageBubble.style.marginTop).toBe("16px");
});

it("margin test same types", () => {
  render(
    <MessageBubble
      text={"test"}
      prevSender={"message-bubble-user"}
      sender={"message-bubble-user"}
    />
  );
  const messageBubble = screen.getByTestId("message-bubble");
  expect(messageBubble.style.marginTop).toBe("8px");
});

it("margin test prevSender volunteer", () => {
  render(
    <MessageBubble
      text={"Test"}
      prevSender={"message-bubble-volunteer"}
      sender={"message-bubble-user"}
    />
  );
  const messageBubble = screen.getByTestId("message-bubble");
  expect(messageBubble.style.marginTop).toBe("16px");
});
