import { useState, createRef } from "react";

import MessageBubble from "./MessageBubble";
import Main from "./Main";
import MessageBox from "./MessageBox";
import { useWebSocket } from "./WebSocket-Context";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  currentThreadNameState,
  messageBubblesState,
  sidebarState,
} from "./atoms";
/**
 * Messenger component is a main part of the application. It contains Main and MessageBox.
 */

export default function Messenger() {
  const sidebarActivated = useRecoilValue(sidebarState);
  const currentThreadName = useRecoilValue(currentThreadNameState);
  const [messageBubbles, setMessageBubbles] =
    useRecoilState(messageBubblesState);
  const [messageTextInput, changeMessageText] = useState("");
  const messagesEndRef = createRef<HTMLDivElement>();
  const { dispatchWebSocket } = useWebSocket();

  /**
   * Scrolls chat to latest message using {@link messagesEndRef} reference
   */
  function scrollToBottom() {
    messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * Creates new User Bubble from {@link messageTextInput}
   */
  function createUserBubble() {
    const sender = "message-bubble-user";

    if (messageTextInput !== "") {
      dispatchWebSocket({
        type: "SEND_MESSAGE",
        message: messageTextInput,
        thread_name: currentThreadName,
      });
      setMessageBubbles((bubbles) => {
        return [
          <MessageBubble
            key={`message-${bubbles.length + 1}`}
            text={messageTextInput}
            sender={sender}
            prevSender={
              bubbles.length === 0
                ? "message-bubble-volunteer"
                : bubbles[0].props.sender
            }
          />,
          ...bubbles,
        ];
      });

      var currentThread = JSON.parse(localStorage.getItem(currentThreadName)!);
      currentThread.messages.push({ text: messageTextInput, sender: sender });
      localStorage.setItem(currentThreadName, JSON.stringify(currentThread));
    }
  }
  /**
   * Creates message bubble, scrolls to bottom and changes input field text.
   */
  function sendMessage() {
    createUserBubble();
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
