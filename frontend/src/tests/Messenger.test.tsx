import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Messenger from "../components/Messenger";
import { RecoilRoot } from "recoil";
import { messageBubblesState, sidebarState } from "../components/atoms";
import { RecoilTestHelper, RecoilObserver } from "./RecoilStateHelper";
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
});

it("empty input test", () => {
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
