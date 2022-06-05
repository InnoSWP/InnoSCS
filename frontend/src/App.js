import Navbar from "./components/Navbar";
import MessageBox from "./components/MessageBox";
import Main from "./components/Main";
import { useState, createRef, useEffect } from "react";
import MessageBubble from "./components/MessageBubble";

function App() {
  const [text, changeText] = useState("");
  const [messageBubbles, addBubble] = useState([]);
  const [ws, setWebSocket] = useState(null);
  const messagesEndRef = createRef();

  useEffect(() => {
    if (ws !== null) {
      console.log("event");
      ws.addEventListener("message", createVolunteerBubble);
    }

    return function () {
      console.log("clean");
      if (ws !== null) ws.removeEventListener("message", createVolunteerBubble);
    };
  }, [ws]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("http://localhost:8000/api/threads/", {
        method: "POST",
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
      if (ws !== null) ws.send(text);
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
