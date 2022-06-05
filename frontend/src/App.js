import Navbar from "./components/Navbar";
import MessageBox from "./components/MessageBox";
import Main from "./components/Main";
import { useState, createRef, useEffect } from "react";
import MessageBubble from "./components/MessageBubble";
var ws = new WebSocket("ws://127.0.0.1:8000/ws/test");

function App() {
  const [text, changeText] = useState("");
  const [messageBubbles, addBubble] = useState([]);
  const messagesEndRef = createRef();

  useEffect(() => {
    ws = new WebSocket("ws://127.0.0.1:8000/ws/test");
    ws.addEventListener("message", createVolunteerBubble);
    return function () {
      ws.removeEventListener("message", createVolunteerBubble);
    };
  }, []);

  function createVolunteerBubble(event) {
    console.log(event);
    const type = "message-bubble-volunteer";
    if (event.data) {
      addBubble((bubbles) => [
        <MessageBubble
          key={bubbles.length + 1}
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

    if (text !== "") {
      ws.send(text);
      addBubble((bubbles) => {
        return [
          <MessageBubble
            key={bubbles.length + 1}
            text={text}
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
    <div>
      <Navbar />
      <Main
        key="main"
        bubbles={messageBubbles}
        messagesEndRef={messagesEndRef}
      />
      <MessageBox
        key="messageBox"
        changeText={changeText}
        createBubble={createBubble}
        scrollToBottom={scrollToBottom}
        inputText={text}
      />
    </div>
  );
}

export default App;
