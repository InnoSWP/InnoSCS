import { useState, useEffect, createRef } from "react";
import MessageBubble from "./MessageBubble";
import Main from "./Main";
import MessageBox from "./MessageBox";

export default function Messenger({ sidebarActivated, webSocket }) {
  const [messageBubbles, addBubble] = useState([]);
  const [messageTextInput, changeMessageText] = useState("");
  const messagesEndRef = createRef();

  useEffect(() => {
    if (webSocket !== null) {
      webSocket.addEventListener("message", createVolunteerBubble);
    }

    return function () {
      if (webSocket !== null)
        webSocket.removeEventListener("message", createVolunteerBubble);
    };
  }, [webSocket]);

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
            key={bubbles.length + 1}
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
