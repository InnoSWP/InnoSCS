import React, { useEffect } from "react";
import { render } from "@testing-library/react";
import WS from "jest-websocket-mock";
let ws: WS;
const setThread = (name: string, messages: Object[]) => {
  localStorage.setItem(
    name,
    JSON.stringify({
      messages: messages,
      current: true,
      status: "resolving",
      id: "1342342342323",
    })
  );
};
beforeAll(async () => {
  ws = new WS("ws://localhost:8080/ws/1342342342323");
  jest.mock("../components/config", () => ({
    WebSocketConfig: {
      address: "localhost",
      port: "8080",
    },
  }));
});

afterEach(() => {
  WS.clean();
});
it("Websocket test", async () => {
  setThread("test", [{ text: "test text", sender: "message-bubble-user" }]);
  setThread("testing", [
    { text: "test message", sender: "message-bubble-volunteer" },
  ]);
  setThread("testing test", []);
  const {
    useWebSocket,
    WebSocketProvider,
  } = require("../components/WebSocket-Context");
  await ws.connected;
  const MockComponent = () => {
    const { dispatchWebSocket } = useWebSocket();
    useEffect(() => {
      dispatchWebSocket({
        type: "CONNECT",
        thread_name: "testing",
        func: () => {
          // mock
        },
      });

      dispatchWebSocket({
        type: "SEND_MESSAGE",
        thread_name: "testing",
        message: "hi",
      });

      dispatchWebSocket({ type: "CLOSE", thread_name: "testing" });
    }, []);

    return <div>test</div>;
  };

  render(
    <WebSocketProvider>
      <MockComponent />
    </WebSocketProvider>
  );
});

it("throw error test", () => {
  const { useWebSocket } = require("../components/WebSocket-Context");
  const MockComponent = () => {
    expect(useWebSocket).toThrowError();

    return <div>test</div>;
  };
  render(<MockComponent />);
});
