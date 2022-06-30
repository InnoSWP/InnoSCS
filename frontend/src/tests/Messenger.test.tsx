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
let jsx_list: JSX.Element[];
let addBubble: jest.Mock<void, [func: (prev: JSX.Element[]) => JSX.Element[]]>;

beforeAll(() => {
  jsx_list = [];
  localStorage.setItem(
    "test",
    JSON.stringify({
      messages: [],
      current: true,
      status: "resolving",
      id: "1232132123",
    })
  );
});

beforeEach(() => {
  addBubble = jest.fn((func: (prev: JSX.Element[]) => JSX.Element[]) => {
    jsx_list = func(jsx_list);
  });
  window.HTMLElement.prototype.scrollIntoView = function () {
    // mock
  };
});
afterEach(cleanup);

it("messenger test", async () => {
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
  jsx_list = [
    <MessageBubble text="test" type="message-bubble-user" prevSender={null} />,
  ];

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
  jsx_list = [
    <MessageBubble text="test" type="message-bubble-user" prevSender={null} />,
  ];

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
  jsx_list = [];

  render(
    <Messenger
      sidebarActivated={true}
      messageBubbles={[]}
      addBubble={addBubble}
      currentThreadName={"test"}
    />
  );
});
