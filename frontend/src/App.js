import Navbar from "./components/Navbar";
import MessageBox from "./components/MessageBox";
import Main from "./components/Main";
import { useState, createRef } from "react";
import MessageBubble from "./components/MessageBubble";

function App() {
  const ws = new WebSocket("ws://127.0.0.1:8000/ws/test");
  const [text, changeText] = useState("");
  const [messageBubbles, addBubble] = useState([]);
  const messagesEndRef = createRef();
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
  function createBubble() {
    const types = ["message-bubble-user", "message-bubble-volunteer"];
    var randomType = types[getRandomInt(2)];

    if (text !== "") {
      ws.send(text);
      addBubble((bubbles) => {
        return [
          <MessageBubble
            key={bubbles.length + 1}
            text={text}
            type={randomType}
            flexibleMargin={
              bubbles.length === 0
                ? 16
                : bubbles[0].props.type === randomType
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
