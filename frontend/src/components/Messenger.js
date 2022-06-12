import { useState, useEffect, createRef } from "react";
import MessageBubble from "./MessageBubble";
import Main from "./Main";
import MessageBox from "./MessageBox";

export default function Messenger(props) {
  const [messageBubbles, addBubble] = useState([]);
  const [messageTextInput, changeMessageText] = useState("");
  const [ws, setWebSocket] = useState(null);
  const messagesEndRef = createRef();

  useEffect(() => {
    if (ws !== null) {
      ws.addEventListener("message", createVolunteerBubble);
    }

    return function () {
      if (ws !== null) ws.removeEventListener("message", createVolunteerBubble);
    };
  }, [ws]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8000/threads/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ questions: [] }),
      });

      const { thread_id } = await response.json();
      console.log(thread_id);
      return thread_id;
    }

    fetchData().then((t) => {
      setWebSocket(new WebSocket("ws://127.0.0.1:8000/ws/" + t));
    });
  }, []);

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
      if (ws !== null) ws.send(messageTextInput);
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
      className={
        props.sidebarActivated ? "main-wrapper activated" : "main-wrapper"
      }
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
