import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import MessageBubble from "../components/MessageBubble";

afterEach(cleanup);

it("margin test different types", () => {
  render(
    <MessageBubble
      text={"test"}
      prevSender={"message-bubble-user"}
      type={"message-bubble-volunteer"}
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
      type={"message-bubble-user"}
    />
  );
  const messageBubble = screen.getByTestId("message-bubble");
  expect(messageBubble.style.marginTop).toBe("8px");
});

it("margin test prevSender null", () => {
  render(
    <MessageBubble
      text={"Test"}
      prevSender={null}
      type={"message-bubble-user"}
    />
  );
  const messageBubble = screen.getByTestId("message-bubble");
  expect(messageBubble.style.marginTop).toBe("16px");
});
