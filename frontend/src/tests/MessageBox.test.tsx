import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import MessageBox from "../components/MessageBox";

afterEach(cleanup);

it("input test", () => {
  const sendMessage = jest.fn();
  let text = "something";
  const changeText = jest.fn((func: (() => string) | string) => {
    if (typeof func === "string") {
      text = func;
    } else text = func();
  });

  const { rerender } = render(
    <MessageBox
      sendMessage={sendMessage}
      changeMessageText={changeText}
      inputText={text}
    />
  );

  const messageInput: HTMLInputElement = screen.getByTestId("message-input");

  expect(messageInput.value).toBe(text);
  fireEvent.change(messageInput, { target: { value: "testing" } });
  rerender(
    <MessageBox
      sendMessage={sendMessage}
      changeMessageText={changeText}
      inputText={text}
    />
  );
  expect(messageInput.value).toBe("testing");
  expect(text).toBe("testing");
});
