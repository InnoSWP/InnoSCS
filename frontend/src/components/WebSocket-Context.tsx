import {
  createContext,
  Dispatch,
  useContext,
  useMemo,
  useReducer,
} from "react";

const WebSocketContext = createContext<
  | {
      webSocketState: WebSocketState;
      dispatchWebSocket: Dispatch<WebSocketAction>;
    }
  | undefined
>(undefined);

const WebSocketConfig = {
  address: "77.91.73.240",
  port: "8000",
};

const initWebSocketState = {
  webSocket: new WebSocket("ws://localhost:8000"),
};

type WebSocketState = {
  webSocket: WebSocket;
};

type WebSocketAction =
  | { type: "CONNECT"; id: string }
  | { type: "LISTEN_MESSAGE"; func: (e: MessageEvent<string>) => void }
  | { type: "SEND_MESSAGE"; message: string }
  | { type: "REMOVE_LISTENER"; func: (e: MessageEvent<string>) => void };

const WebSocketReducer = (state: WebSocketState, action: WebSocketAction) => {
  switch (action.type) {
    case "CONNECT":
      state.webSocket.close();
      const newWebSocket = new WebSocket(
        `ws://${WebSocketConfig.address}:${WebSocketConfig.port}/ws/${action.id}`
      );
      return { webSocket: newWebSocket };

    case "LISTEN_MESSAGE":
      state.webSocket.addEventListener("message", action.func);
      return state;

    case "REMOVE_LISTENER":
      state.webSocket.removeEventListener("message", action.func);
      return state;

    case "SEND_MESSAGE":
      state.webSocket.send(action.message);
      return state;
  }
};

type WebSocketProviderProps = {
  children: React.ReactNode;
};

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [webSocketState, dispatchWebSocket] = useReducer(
    WebSocketReducer,
    initWebSocketState
  );
  const value = useMemo(() => {
    return { webSocketState, dispatchWebSocket };
  }, [webSocketState]);
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined)
    throw new Error("useWebSocket must be within WebSocketProvider");

  return context;
};

export { useWebSocket, WebSocketProvider, WebSocketConfig };
