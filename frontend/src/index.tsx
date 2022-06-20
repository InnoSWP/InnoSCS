import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WebSocketProvider } from "./components/WebSocket-Context";
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <WebSocketProvider>
    <App />
  </WebSocketProvider>
);
