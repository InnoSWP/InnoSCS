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
import { useEffect } from "react";
import {
  useRecoilState,
  useRecoilValue,
  RecoilState,
  RecoilRoot,
} from "recoil";
import {
  sidebarState,
  messageBubblesState,
  currentThreadNameState,
} from "../components/atoms";

type WebSocketAction =
  | {
      type: "CONNECT";
      thread_name: string;
      func: (event: MessageEvent<string>, thread_name: string) => void;
    }
  | { type: "SEND_MESSAGE"; message: string; thread_name: string }
  | { type: "CLOSE"; thread_name: string };
const dispatchWebSocketMockImplementation = (
  action: WebSocketAction,
  event: MessageEvent<string>,
  name: string
) => {
  if (action.type === "CONNECT") {
    action.func(event, name);
  }
};

const setThread = (name: string, messages: Object[]) => {
  localStorage.setItem(
    name,
    JSON.stringify({
      messages: messages,
      current: true,
      status: "resolving",
      id: "1232132123",
    })
  );
};

beforeEach(() => {
  setThread("test", [{ text: "test text", sender: "message-bubble-user" }]);
  setThread("testing", [
    { text: "test message", sender: "message-bubble-volunteer" },
  ]);
  setThread("testing test", []);
});
afterEach(() => {
  cleanup();
});

type RecoilObserverProps = {
  node: RecoilState<any>;
  onChange: Function;
};

const RecoilObserver = ({ node, onChange }: RecoilObserverProps) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

type RecoilStateHelperProps = {
  sidebarActivated: boolean;
  messageBubbles: JSX.Element[];
  currentThreadName: string;
};
const RecoilTestHelper = ({
  sidebarActivated,
  messageBubbles,
  currentThreadName,
}: RecoilStateHelperProps) => {
  const [, toggleSideBar] = useRecoilState(sidebarState);
  const [, addBubble] = useRecoilState(messageBubblesState);
  const [, setCurrentThreadName] = useRecoilState(currentThreadNameState);
  toggleSideBar(sidebarActivated);
  addBubble(messageBubbles);
  setCurrentThreadName(currentThreadName);
  return <div></div>;
};

it("sidebar test", async () => {
  let bubbles: JSX.Element[] = [];

  const mockDispatchWebSocket = jest
    .fn()
    .mockImplementationOnce((action: WebSocketAction) => {
      bubbles = [<div>Hi</div>];
      dispatchWebSocketMockImplementation(
        action,
        new MessageEvent<string>("hello test", { data: "hello there" }),
        "testing"
      );
    })
    .mockImplementationOnce((action: WebSocketAction) => {
      dispatchWebSocketMockImplementation(
        action,
        new MessageEvent<string>("hello test"),
        "testing 2"
      );
    })
    .mockImplementationOnce((action: WebSocketAction) => {
      dispatchWebSocketMockImplementation(
        action,
        new MessageEvent<string>("hello test", { data: "something" }),
        "test"
      );
    })
    .mockImplementationOnce((action: WebSocketAction) => {
      dispatchWebSocketMockImplementation(
        action,
        new MessageEvent<string>("hello test", { data: "hello there" }),
        "testing test"
      );
    });

  jest.mock("../components/config", () => ({
    WebSocketConfig: {
      address: "localhost",
      port: "8000",
    },
  }));
  const mock_api = { id: 54534534 };
  global.fetch = jest.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve({
          json: () =>
            new Promise((resolveJson) => {
              resolveJson(mock_api);
            }),
          text: () =>
            new Promise((resolveText) => {
              resolveText(JSON.stringify(mock_api));
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
    <RecoilRoot>
      <WebSocketProvider
        debugValue={{
          dispatchWebSocket: mockDispatchWebSocket,
          webSocketState: { webSocket: {} },
        }}
      >
        <RecoilObserver node={sidebarState} onChange={toggleSideBar} />
        <RecoilObserver
          node={currentThreadNameState}
          onChange={setCurrentThreadName}
        />
        <RecoilObserver node={messageBubblesState} onChange={addBubble} />
        <SideBar />
      </WebSocketProvider>
    </RecoilRoot>
  );
  let inputSubmit: HTMLInputElement | null = screen.queryByTestId(
    "submit-problem-input"
  );
  let submitButton = screen.queryByTestId("submit-button");
  const addButton = screen.getByTestId("add-button");

  await waitFor(() => {
    inputSubmit = screen.queryByTestId("submit-problem-input");
    submitButton = screen.queryByTestId("submit-button");
  });

  fireEvent.click(addButton);
  fireEvent.change(inputSubmit!, { target: { value: "testing 2" } });

  await waitFor(() => {
    expect(inputSubmit!.value).toBe("testing 2");
  });
  fireEvent.click(submitButton!);

  const threads = await screen.findAllByTestId("thread-container");

  fireEvent.click(threads[0]);

  jest.useFakeTimers();
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  rerender(
    <RecoilRoot>
      <WebSocketProvider
        debugValue={{
          dispatchWebSocket: mockDispatchWebSocket,
          webSocketState: { webSocket: {} },
        }}
      >
        <RecoilObserver node={sidebarState} onChange={toggleSideBar} />
        <RecoilObserver
          node={currentThreadNameState}
          onChange={setCurrentThreadName}
        />
        <RecoilObserver node={messageBubblesState} onChange={addBubble} />
        <SideBar />
      </WebSocketProvider>
    </RecoilRoot>
  );

  expect(setCurrentThreadName).toBeCalled();
  expect(currentThreadName).toBe("test");
  expect(addBubble).toBeCalled();

  for (let i = 3; i < 6; i++) {
    fireEvent.click(addButton);
    fireEvent.change(inputSubmit!, { target: { value: `testing ${i}` } });
    await waitFor(() => {
      expect(inputSubmit!.value).toBe(`testing ${i}`);
    });
    fireEvent.click(submitButton!);
  }

  fireEvent.click(threads[1]);

  expect(addButton.className).toBe("add-button removed");

  fireEvent.click(addButton);
  fireEvent.click(submitButton!);

  rerender(
    <RecoilRoot>
      <WebSocketProvider
        debugValue={{
          dispatchWebSocket: mockDispatchWebSocket,
          webSocketState: { webSocket: {} },
        }}
      >
        <RecoilObserver node={sidebarState} onChange={toggleSideBar} />
        <RecoilObserver
          node={currentThreadNameState}
          onChange={setCurrentThreadName}
        />
        <RecoilObserver node={messageBubblesState} onChange={addBubble} />
        <SideBar />
      </WebSocketProvider>
    </RecoilRoot>
  );

  expect(addButton.className).toBe("add-button");
});
