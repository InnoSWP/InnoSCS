import { useState, createRef, useEffect, useCallback } from "react";

import MessageBubble from "./MessageBubble";
import Main from "./Main";
import MessageBox from "./MessageBox";
import { useWebSocket } from "./WebSocket-Context";
/**
 * Messenger component is a main part of the application. It contains Main and MessageBox.
 * @param {{sidebarActivated: boolean, webSocket: WebSocket, addBubble: function, messageBubbles: Array.<MessageBubble>, currentThreadName: string}} props
 * @param {boolean} sidebarActivated represents the state of the SideBar component
 * @param {WebSocket} webSocket current WebSocket connection
 * @param {function} addBubble changes the state of the MessageBubble list
 * @param {Array.<MessageBubble>} messageBubbles list of the messageBubbles
 * @param {string} currentThreadName name of the current thread
 */

type Props = {
  sidebarActivated: boolean;
  addBubble: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
  messageBubbles: JSX.Element[];
  currentThreadName: string;
};

export default function Messenger({
  sidebarActivated,
  addBubble,
  messageBubbles,
  currentThreadName,
}: Props) {
  const [messageTextInput, changeMessageText] = useState("");
  const messagesEndRef = createRef<HTMLDivElement>();
  const { webSocketState, dispatchWebSocket } = useWebSocket();

  /**
   * Creates Volunteer Bubble
   *
   * In current implementation is used for {@link webSocket} listener event
   */
  const createVolunteerBubble = useCallback(
    (event: MessageEvent<string>) => {
      const type = "message-bubble-volunteer";
      if (event.data) {
        addBubble((bubbles) => [
          <MessageBubble
            key={`message-${bubbles.length + 1}`}
            text={event.data}
            type={type}
            prevSender={bubbles.length === 0 ? null : bubbles[0].props.type}
          />,
          ...bubbles,
        ]);
      }
    },
    [addBubble]
  );

  useEffect(() => {
    webSocketState.webSocket.addEventListener("message", createVolunteerBubble);
    console.log("mount event");
    return function () {
      webSocketState.webSocket.removeEventListener(
        "message",
        createVolunteerBubble
      );
      console.log("unmount event");
    };
  }, [webSocketState, createVolunteerBubble]);

  /**
   * Scrolls chat to latest message using {@link messagesEndRef} reference
   */
  function scrollToBottom() {
    messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Creates new User Bubble from {@link messageTextInput}
   */
  function createBubble() {
    const type = "message-bubble-user";

    if (messageTextInput !== "") {
      webSocketState.webSocket.send(messageTextInput);
      addBubble((bubbles) => {
        return [
          <MessageBubble
            key={`message-${bubbles.length + 1}`}
            text={messageTextInput}
            type={type}
            prevSender={bubbles.length === 0 ? null : bubbles[0].props.type}
          />,
          ...bubbles,
        ];
      });

      var currentThread = JSON.parse(localStorage.getItem(currentThreadName)!);
      currentThread.messages.push({ text: messageTextInput, sender: type });
      localStorage.setItem(currentThreadName, JSON.stringify(currentThread));
    }
  }
  /**
   * Creates message bubble, scrolls to bottom and changes input field text.
   */
  function sendMessage() {
    createBubble();
    scrollToBottom();
    changeMessageText(() => "");
  }

  return (
    <div
      className={sidebarActivated ? "main-wrapper activated" : "main-wrapper"}
    >
      <Main
        key="main"
        bubbles={messageBubbles}
        messagesEndRef={messagesEndRef}
      />
      <MessageBox
        key="messageBox"
        inputText={messageTextInput}
        sendMessage={sendMessage}
        changeMessageText={changeMessageText}
      />
    </div>
  );
}
