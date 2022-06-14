import Modal from "./Modal";
import Thread from "./Thread";
import MessageBubble from "./MessageBubble";
import SubmitProblemNotification from "./SubmitProblemNotification";
import { useEffect, useState } from "react";
import "./styles/sidebar.css";
export default function SideBar({
  toggleSideBar,
  sideBarActivated,
  setWebSocket,
  addBubble,
  setCurrentThreadName,
  currentThreadName,
}) {
  const [submitProblemTextInput, changeSubmitProblemText] = useState("");
  const [modalActivated, toggleModal] = useState(false);
  const [submitProblemActivated, toggleSubmitProblem] = useState(false);
  const [threads, addThread] = useState([]);

  useEffect(() => {
    addThread([]);
    for (let i = 0; i < localStorage.length; i++) {
      addThread((threads) => [
        ...threads,
        <Thread
          key={`thread-${threads.length + 1}`}
          problemName={localStorage.key(i)}
          status={"resolving"}
          openThread={openThread}
        />,
      ]);
    }
  }, [currentThreadName]);

  function openThread(problemName) {
    toggleSideBar((prev) => !prev);
    const currentThread = JSON.parse(localStorage.getItem(problemName));
    const threadMessages = [];
    for (var m in currentThread.messages) {
      threadMessages.push(
        <MessageBubble
          key={`message-${threadMessages.length + 1}`}
          text={currentThread.messages[m].text}
          type={currentThread.messages[m].sender}
          flexibleMargin={
            threadMessages.length === 0
              ? 16
              : threadMessages[0].props.type === m.sender
              ? 8
              : 16
          }
        />
      );
    }
    addBubble(threadMessages.reverse());
    setCurrentThreadName(problemName);
  }

  function toggleBlur(status) {
    if (document.getElementById("modal") !== undefined) {
      if (status) document.getElementById("modal").classList.add("blurred");
      else document.getElementById("modal").classList.remove("blurred");
    }
  }

  function createThread() {
    toggleModal((prev) => !prev);
  }
  // TODO: change it later
  useEffect(() => {
    if (modalActivated !== false) {
      toggleSideBar((prev) => !prev);
      toggleBlur(true);
      toggleSubmitProblem((prev) => !prev);
    }
  }, [modalActivated]);

  function submitThread() {
    if (submitProblemTextInput !== "") {
      addThread((threads) => {
        const newThreadElement = (
          <Thread
            key={`thread-${threads.length + 1}`}
            problemName={submitProblemTextInput}
            status={"resolving"}
            openThread={openThread}
          />
        );

        const newThread = {
          status: "resolving",
          messages: [],
        };
        localStorage.setItem(submitProblemTextInput, JSON.stringify(newThread));
        return [...threads, newThreadElement];
      });
    }

    toggleSubmitProblem((prev) => !prev);
    toggleBlur(false);
    toggleSideBar((prev) => !prev);
    changeSubmitProblemText("");
    // TODO: change it later
    setTimeout(() => {
      toggleModal((prev) => !prev);
    }, 500);
  }

  return (
    <div>
      <div className="sidebar-wrapper">{threads}</div>
      <button
        className={sideBarActivated ? "add-button" : "add-button removed"}
        onClick={createThread}
      >
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
      <Modal isOpen={modalActivated}>
        <SubmitProblemNotification
          changeText={changeSubmitProblemText}
          inputText={submitProblemTextInput}
          show={submitProblemActivated}
          submitThread={submitThread}
        />
      </Modal>
    </div>
  );
}
