import { fireEvent, render, screen } from "@testing-library/react";
import { WebSocketProvider } from "../components/WebSocket-Context";
import App from "../App";

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
  );
  const menuOptions = screen.getAllByTestId("menu-option");
  for (let i = 0; i < menuOptions.length; i++) {
    fireEvent.click(menuOptions[i]);
  }

  const yesButton = screen.getByTestId("yes-button");
  fireEvent.click(yesButton);
});
