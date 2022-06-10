import Navbar from "./components/Navbar";
import MessageBox from "./components/MessageBox";
import Main from "./components/Main";
import { useState, createRef, useEffect } from "react";
import MessageBubble from "./components/MessageBubble";
import SideBar from "./components/SideBar";
import Thread from "./components/Thread";
import SubmitProblemNotification from "./components/SubmitProblemNotification";

function App() {
  const [messageTextInput, changeMessageText] = useState("");
  const [submitProblemTextInput, changeSubmitProblemText] = useState("");
  const [messageBubbles, addBubble] = useState([]);
  const [ws, setWebSocket] = useState(null);
  const [sidebarActivated, toggleSideBar] = useState(false);
  const [blurActivated, toggleBlur] = useState(false);
  const [submitProblemActivated, toggleSubmitProblem] = useState(false);
  const [threads, addThread] = useState([
    <Thread problemName={"Lorem ipsum"} status={"resolving"} />,
    <Thread problemName={"Some other problem"} status={"solved"} />,
    <Thread problemName={"Some new problem"} status={"unsolved"} />,
  ]);
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

  function createThread() {
    toggleSideBar((prev) => !prev);
    toggleBlur((prev) => !prev);
    toggleSubmitProblem((prev) => !prev);
  }

  function submitThread() {
    if (submitProblemTextInput !== "") {
      addThread((threads) => [
        ...threads,
        <Thread problemName={submitProblemTextInput} status={"resolving"} />,
      ]);
    }

    toggleSubmitProblem((prev) => !prev);
    toggleBlur((prev) => !prev);
    toggleSideBar((prev) => !prev);
    changeSubmitProblemText("");
  }

  function createVolunteerBubble(event) {
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
    <div id="app">
      <div className={blurActivated ? "blurred activated" : "blurred"}>
        <Navbar
          toggleSideBar={toggleSideBar}
          sideBarActivated={sidebarActivated}
        />
        <SideBar threads={threads} />
        <button className="add-button" onClick={createThread}>
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.3333 24.9048H24.9048V36.3334H21.0952V24.9048H9.66666V21.0953H21.0952V9.66669H24.9048V21.0953H36.3333V24.9048Z"
              fill="white"
            />
          </svg>
        </button>
        <div
          className={
            sidebarActivated ? "main-wrapper activated" : "main-wrapper"
          }
        >
          <Main
            key="main"
            bubbles={messageBubbles}
            messagesEndRef={messagesEndRef}
          />
          <MessageBox
            key="messageBox"
            changeText={changeMessageText}
            createBubble={createBubble}
            scrollToBottom={scrollToBottom}
            inputText={messageTextInput}
          />
        </div>
      </div>
      <SubmitProblemNotification
        changeText={changeSubmitProblemText}
        inputText={submitProblemTextInput}
        show={submitProblemActivated}
        submitThread={submitThread}
      />
    </div>
  );
}

export default App;
