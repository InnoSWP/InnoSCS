import { useState, createRef } from "react";

import MessageBubble from "./MessageBubble";
import Main from "./Main";
import MessageBox from "./MessageBox";

export default function Messenger({
  sidebarActivated,
  webSocket,
  addBubble,
  messageBubbles,
  currentThreadName,
}) {
  const [messageTextInput, changeMessageText] = useState("");
  const messagesEndRef = createRef();

  function createVolunteerBubble(event) {
    const type = "message-bubble-volunteer";
    if (event.data) {
      addBubble((bubbles) => [
        <MessageBubble
          key={`message-${bubbles.length + 1}`}
          text={event.data}
          type={type}
          flexibleMargin={
            bubbles.length === 0 ? 16 : bubbles[0].props.type === type ? 8 : 16
          }
        />,
        ...bubbles,
      ]);
    }
  }

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function createBubble() {
    const type = "message-bubble-user";

    if (messageTextInput !== "") {
      if (webSocket !== null) webSocket.send(messageTextInput);
      addBubble((bubbles) => {
        return [
          <MessageBubble
            key={`message-${bubbles.length + 1}`}
            text={messageTextInput}
            type={type}
            flexibleMargin={
              bubbles.length === 0
                ? 16
                : bubbles[0].props.type === type
                ? 8
                : 16
            }
          />,
          ...bubbles,
        ];
      });

      if (localStorage.getItem(currentThreadName) !== null) {
        var currentThread = JSON.parse(localStorage.getItem(currentThreadName));
        currentThread.messages.push({ text: messageTextInput, sender: type });
        localStorage.setItem(currentThreadName, JSON.stringify(currentThread));
      }
    }
  }

  return (
    <div
      className={sidebarActivated ? "main-wrapper activated" : "main-wrapper"}
    >
      <Main
        key="main"
        bubbles={messageBubbles}
        messagesEndRef={messagesEndRef}
        // TODO: pass messagesEndRef to MessageBubble props
      />
      <MessageBox
        key="messageBox"
        changeText={changeMessageText}
        createBubble={createBubble}
        scrollToBottom={scrollToBottom}
        inputText={messageTextInput}
      />
    </div>
  );
}
