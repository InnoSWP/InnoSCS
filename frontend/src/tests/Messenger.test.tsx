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
import { useEffect } from "react";
import {
  RecoilRoot,
  RecoilState,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import {
  currentThreadNameState,
  messageBubblesState,
  sidebarState,
} from "../components/atoms";
jest.mock("../components/WebSocket-Context", () => ({
  useWebSocket: () => ({
    dispatchWebSocket: jest.fn(),
  }),
}));
let jsx_list: JSX.Element[];
let addBubble: jest.Mock<void, [prev: JSX.Element[]]>;

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
  addBubble = jest.fn((list: JSX.Element[]) => {
    jsx_list = list;
  });
  window.HTMLElement.prototype.scrollIntoView = function () {
    // mock
  };
});
afterEach(cleanup);

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

it("messenger test", async () => {
  render(
    <RecoilRoot>
      <RecoilTestHelper
        sidebarActivated={false}
        messageBubbles={[]}
        currentThreadName={"test"}
      />
      <RecoilObserver node={sidebarState} onChange={addBubble} />
      <Messenger />
    </RecoilRoot>
  );

  const buttonSend = screen.getByTestId("button-send");
  const inputText: HTMLInputElement = screen.getByTestId("message-input");
  fireEvent.change(inputText, { target: { value: "testing" } });
  await waitFor(() => {
    expect(inputText.value).toBe("testing");
  });
  fireEvent.click(buttonSend);

  expect(addBubble).toBeCalled();
  // expect(jsx_list.length).toBe(1);
});

it("empty input test", () => {
  jsx_list = [
    <MessageBubble
      text="test"
      sender="message-bubble-user"
      prevSender={"message-bubble-volunteer"}
    />,
  ];

  render(
    <RecoilRoot>
      <RecoilTestHelper
        sidebarActivated={false}
        messageBubbles={[]}
        currentThreadName={"test"}
      />
      <RecoilObserver node={messageBubblesState} onChange={addBubble} />
      <Messenger />
    </RecoilRoot>
  );

  const buttonSend = screen.getByTestId("button-send");
  fireEvent.click(buttonSend);
});

it("prevSender test", async () => {
  jsx_list = [
    <MessageBubble
      text="test"
      sender="message-bubble-user"
      prevSender={"message-bubble-volunteer"}
    />,
  ];

  render(
    <RecoilRoot>
      <RecoilTestHelper
        sidebarActivated={false}
        messageBubbles={[]}
        currentThreadName={"test"}
      />
      <RecoilObserver node={messageBubblesState} onChange={addBubble} />
      <Messenger />
    </RecoilRoot>
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
  render(
    <RecoilRoot>
      <RecoilTestHelper
        sidebarActivated={true}
        messageBubbles={[]}
        currentThreadName={"test"}
      />
      <RecoilObserver node={messageBubblesState} onChange={addBubble} />
      <Messenger />
    </RecoilRoot>
  );
});
