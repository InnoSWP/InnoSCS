import { fireEvent, render, screen } from "@testing-library/react";
import { WebSocketProvider } from "../components/WebSocket-Context";
import App from "../App";
import { RecoilRoot } from "recoil";

it("test App", () => {
  localStorage.setItem(
    "thread",
    JSON.stringify({
      id: "foo",
      messages: [],
      current: true,
    })
  );
  render(
    <RecoilRoot>
      <WebSocketProvider
        debugValue={{
          webSocketState: { webSocket: {} },
          dispatchWebSocket: () => {
            // mock
          },
        }}
      >
        <App />
      </WebSocketProvider>
    </RecoilRoot>
  );
});
