import {
  createContext,
  Dispatch,
  useContext,
  useMemo,
  useReducer,
} from "react";

const getThreadIdByName = (threadName: string) => {
  return JSON.parse(localStorage.getItem(threadName)!).id;
};

const WebSocketContext = createContext<
  | {
      webSocketState: WebSocketState;
      dispatchWebSocket: Dispatch<WebSocketAction>;
    }
  | undefined
>(undefined);

const WebSocketConfig = {
  address: process.env.REACT_APP_IP,
  port: process.env.REACT_APP_PORT,
};

const initState = () => {
  var webSockets = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)!;
    webSockets = {
      ...webSockets,
      [key]: new WebSocket(
        `ws://${WebSocketConfig.address}:${
          WebSocketConfig.port
        }/ws/${getThreadIdByName(key)}`
      ),
    };
  }
  return webSockets;
};

const initWebSocketState: WebSocketState = {
  webSocket: initState(),
};

type WebSocketState = {
  webSocket: {
    [id: string]: WebSocket;
  };
};

type WebSocketAction =
  | {
      type: "CONNECT";
      thread_name: string;
      func: (event: MessageEvent<string>, thread_name: string) => void;
    }
  | { type: "SEND_MESSAGE"; message: string; thread_name: string }
  | { type: "CLOSE"; thread_name: string };

const WebSocketReducer = (state: WebSocketState, action: WebSocketAction) => {
  switch (action.type) {
    case "CONNECT":
      const newWebSocket = new WebSocket(
        `ws://${WebSocketConfig.address}:${
          WebSocketConfig.port
        }/ws/${getThreadIdByName(action.thread_name)}`
      );
      newWebSocket.onmessage = (ev: MessageEvent<string>) =>
        action.func(ev, action.thread_name);
      return {
        webSocket: { ...state.webSocket, [action.thread_name]: newWebSocket },
      };

    case "SEND_MESSAGE":
      state.webSocket[action.thread_name].send(action.message);
      return state;

    case "CLOSE":
      state.webSocket[action.thread_name].close();
      delete state.webSocket[action.thread_name];
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

export { useWebSocket, WebSocketProvider, WebSocketConfig, getThreadIdByName };
