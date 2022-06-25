import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Messenger from "../components/Messenger";
import MessageBubble from "../components/MessageBubble";
jest.mock("../components/WebSocket-Context", () => ({
  useWebSocket: () => ({
    dispatchWebSocket: jest.fn(),
  }),
}));

afterEach(cleanup);

it("messenger test", async () => {
  let jsx_list: JSX.Element[] = [];
  const addBubble = jest.fn((func: (prev: JSX.Element[]) => JSX.Element[]) => {
    jsx_list = func(jsx_list);
  });
  window.HTMLElement.prototype.scrollIntoView = function () {};
  localStorage.setItem(
    "test",
    JSON.stringify({
      messages: [],
      current: true,
      status: "resolving",
      id: "1232132123",
    })
  );
  render(
    <Messenger
      sidebarActivated={false}
      messageBubbles={[]}
      addBubble={addBubble}
      currentThreadName={"test"}
    />
  );

  const buttonSend = screen.getByTestId("button-send");
  const inputText: HTMLInputElement = screen.getByTestId("message-input");
  fireEvent.change(inputText, { target: { value: "testing" } });
  await waitFor(() => {
    expect(inputText.value).toBe("testing");
  });
  fireEvent.click(buttonSend);

  expect(addBubble).toBeCalled();
  expect(jsx_list.length).toBe(1);
});

it("empty input test", () => {
  let jsx_list: JSX.Element[] = [
    <MessageBubble text="test" type="message-bubble-user" prevSender={null} />,
  ];
  const addBubble = jest.fn((func: (prev: JSX.Element[]) => JSX.Element[]) => {
    jsx_list = func(jsx_list);
  });
  window.HTMLElement.prototype.scrollIntoView = function () {};
  localStorage.setItem(
    "test",
    JSON.stringify({
      messages: [],
      current: true,
      status: "resolving",
      id: "1232132123",
    })
  );
  render(
    <Messenger
      sidebarActivated={false}
      messageBubbles={[]}
      addBubble={addBubble}
      currentThreadName={"test"}
    />
  );

  const buttonSend = screen.getByTestId("button-send");
  fireEvent.click(buttonSend);
});

it("prevSender test", async () => {
  let jsx_list: JSX.Element[] = [
    <MessageBubble text="test" type="message-bubble-user" prevSender={null} />,
  ];
  const addBubble = jest.fn((func: (prev: JSX.Element[]) => JSX.Element[]) => {
    jsx_list = func(jsx_list);
  });
  window.HTMLElement.prototype.scrollIntoView = function () {};
  localStorage.setItem(
    "test",
    JSON.stringify({
      messages: [],
      current: true,
      status: "resolving",
      id: "1232132123",
    })
  );
  render(
    <Messenger
      sidebarActivated={false}
      messageBubbles={[]}
      addBubble={addBubble}
      currentThreadName={"test"}
    />
  );

  const buttonSend = screen.getByTestId("button-send");
  const inputText: HTMLInputElement = screen.getByTestId("message-input");
  fireEvent.change(inputText, { target: { value: "testing" } });
  await waitFor(() => {
    expect(inputText.value).toBe("testing");
  });
  fireEvent.click(buttonSend);
});

it("sidebar test", () => {
  let jsx_list: JSX.Element[] = [];
  const addBubble = jest.fn((func: (prev: JSX.Element[]) => JSX.Element[]) => {
    jsx_list = func(jsx_list);
  });
  window.HTMLElement.prototype.scrollIntoView = function () {};
  localStorage.setItem(
    "test",
    JSON.stringify({
      messages: [],
      current: true,
      status: "resolving",
      id: "1232132123",
    })
  );
  render(
    <Messenger
      sidebarActivated={true}
      messageBubbles={[]}
      addBubble={addBubble}
      currentThreadName={"test"}
    />
  );
});
