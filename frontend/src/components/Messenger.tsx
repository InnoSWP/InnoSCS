import { useState, createRef } from "react";

import MessageBubble from "./MessageBubble";
import Main from "./Main";
import MessageBox from "./MessageBox";
import { useWebSocket } from "./WebSocket-Context";
import { useRecoilValue } from "recoil";
import { currentThreadNameState, sidebarState } from "./atoms";
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
  addBubble: (func: (prev: JSX.Element[]) => JSX.Element[]) => void;
  messageBubbles: JSX.Element[];
};

export default function Messenger({ addBubble, messageBubbles }: Props) {
  const sidebarActivated = useRecoilValue(sidebarState);
  const [messageTextInput, changeMessageText] = useState("");
  const messagesEndRef = createRef<HTMLDivElement>();
  const { dispatchWebSocket } = useWebSocket();
  const currentThreadName = useRecoilValue(currentThreadNameState);

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
      dispatchWebSocket({
        type: "SEND_MESSAGE",
        message: messageTextInput,
        thread_name: currentThreadName,
      });
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
