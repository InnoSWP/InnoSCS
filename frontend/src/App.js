import Navbar from "./components/Navbar";
import MessageBox from "./components/MessageBox";
import Main from "./components/Main";
import { useState, createRef, useEffect } from "react";
import MessageBubble from "./components/MessageBubble";
import SideBar from "./components/SideBar";
import Thread from "./components/Thread";
import KebabMenu from "./components/KebabMenu";

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
  const [menuActivated, toggleMenuPopup] = useState(false);
  const opts = [
    {
      optionName: "Close thread",
      onClick: () => console.log("Thread closed"),
    },
    {
      optionName: "Settings",
      onClick: () => console.log("Settings opened"),
    },
    {
      optionName: "Change Volunteer",
      onClick: () => console.log("Volunteer changed"),
    },
  ];
  const messagesEndRef = createRef();
  useEffect(() => {
    console.log(menuActivated);
  }, [menuActivated]);
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
          key="navbar"
          toggleSideBar={toggleSideBar}
          togglePopup={toggleMenuPopup}
          sideBarActivated={sidebarActivated}
        />

        <SideBar
          key="sidebar"
          threads={threads}
          createThread={createThread}
          sideBarActivated={sidebarActivated}
        />

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
      <KebabMenu
        active={menuActivated}
        togglePopup={toggleMenuPopup}
        optionsData={opts}
      />
    </div>
  );
}

export default App;
