import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import SideBar from "../components/SideBar";
import { WebSocketProvider } from "../components/WebSocket-Context";
import { act } from "react-dom/test-utils";

type WebSocketAction =
  | {
      type: "CONNECT";
      thread_name: string;
      func: (event: MessageEvent<string>, thread_name: string) => void;
    }
  | { type: "SEND_MESSAGE"; message: string; thread_name: string }
  | { type: "CLOSE"; thread_name: string };

afterAll(() => {
  cleanup();
});

it("sidebar test", async () => {
  let bubbles: JSX.Element[] = [];

  const mockDispatchWebSocket = jest
    .fn()
    .mockImplementationOnce((action: WebSocketAction) => {
      switch (action.type) {
        case "CONNECT":
          bubbles = [<div>Hi</div>];
          action.func(
            new MessageEvent<string>("hello test", { data: "hello there" }),
            "testing"
          );
      }
    })
    .mockImplementationOnce((action: WebSocketAction) => {
      switch (action.type) {
        case "CONNECT":
          action.func(new MessageEvent<string>("hello test"), "testing 2");
      }
    })
    .mockImplementationOnce((action: WebSocketAction) => {
      switch (action.type) {
        case "CONNECT":
          action.func(
            new MessageEvent<string>("hello test", { data: "something" }),
            "test"
          );
      }
    })
    .mockImplementationOnce((action: WebSocketAction) => {
      switch (action.type) {
        case "CONNECT":
          action.func(
            new MessageEvent<string>("hello test", { data: "hello there" }),
            "testing test"
          );
      }
    });

  jest.mock("../components/config", () => ({
    WebSocketConfig: {
      address: "localhost",
      port: "8000",
    },
  }));
  localStorage.setItem(
    "test",
    JSON.stringify({
      messages: [{ text: "test text", sender: "message-bubble-user" }],
      current: true,
      status: "resolving",
      id: "1232132123",
    })
  );

  localStorage.setItem(
    "testing",
    JSON.stringify({
      messages: [{ text: "test message", sender: "message-bubble-volunteer" }],
      current: true,
      status: "resolving",
      id: "123",
    })
  );
  localStorage.setItem(
    "testing test",
    JSON.stringify({
      messages: [],
      current: true,
      status: "resolving",
      id: "123",
    })
  );
  const mock_api = { id: 54534534 };
  global.fetch = jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve({
          json: () =>
            new Promise((resolve) => {
              resolve(mock_api);
            }),
          text: () =>
            new Promise((resolve) => {
              resolve(JSON.stringify(mock_api));
            }),
        });
      })
  );

  const activated = false;
  let currentThreadName = "";
  const toggleSideBar = jest.fn();
  const addBubble = jest.fn(
    (func: ((prev: JSX.Element[]) => JSX.Element[]) | JSX.Element[]) => {
      if (typeof func === "function") {
        bubbles = func(bubbles);
      } else bubbles = func;
      bubbles = [];
    }
  );
  const setCurrentThreadName = jest.fn(
    (func: ((prev: string) => string) | string) => {
      if (typeof func == "string") {
        currentThreadName = func;
      } else {
        currentThreadName = func(currentThreadName);
      }
    }
  );

  const { rerender } = render(
    <WebSocketProvider
      debugValue={{
        dispatchWebSocket: mockDispatchWebSocket,
        webSocketState: { webSocket: {} },
      }}
    >
      <SideBar
        toggleSideBar={toggleSideBar}
        sideBarActivated={activated}
        addBubble={addBubble}
        setCurrentThreadName={setCurrentThreadName}
        currentThreadName={currentThreadName}
      />
    </WebSocketProvider>
  );

  const addButton = screen.getByTestId("add-button");
  const inputSubmit: HTMLInputElement = screen.getByTestId(
    "submit-problem-input"
  );
  const submitButton = screen.getByTestId("submit-button");

  fireEvent.click(addButton);
  fireEvent.change(inputSubmit, { target: { value: "testing 2" } });
  await waitFor(() => {
    expect(inputSubmit.value).toBe("testing 2");
  });
  fireEvent.click(submitButton);

  const threads = await screen.findAllByTestId("thread-container");

  fireEvent.click(threads[0]);

  jest.useFakeTimers();
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  rerender(
    <WebSocketProvider
      debugValue={{
        dispatchWebSocket: mockDispatchWebSocket,
        webSocketState: { webSocket: {} },
      }}
    >
      <SideBar
        toggleSideBar={toggleSideBar}
        sideBarActivated={activated}
        addBubble={addBubble}
        setCurrentThreadName={setCurrentThreadName}
        currentThreadName={currentThreadName}
      />
    </WebSocketProvider>
  );

  expect(setCurrentThreadName).toBeCalled();
  expect(currentThreadName).toBe("test");
  expect(addBubble).toBeCalled();

  for (let i = 3; i < 6; i++) {
    fireEvent.click(addButton);
    fireEvent.change(inputSubmit, { target: { value: `testing ${i}` } });
    await waitFor(() => {
      expect(inputSubmit.value).toBe(`testing ${i}`);
    });
    fireEvent.click(submitButton);
  }

  fireEvent.click(threads[1]);

  expect(addButton.className).toBe("add-button removed");

  fireEvent.click(addButton);
  fireEvent.click(submitButton);

  rerender(
    <WebSocketProvider
      debugValue={{
        dispatchWebSocket: mockDispatchWebSocket,
        webSocketState: { webSocket: {} },
      }}
    >
      <SideBar
        toggleSideBar={toggleSideBar}
        sideBarActivated={!activated}
        addBubble={addBubble}
        setCurrentThreadName={setCurrentThreadName}
        currentThreadName={currentThreadName}
      />
    </WebSocketProvider>
  );

  expect(addButton.className).toBe("add-button");
});
