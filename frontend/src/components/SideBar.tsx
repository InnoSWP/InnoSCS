import { useEffect, useReducer, useState } from "react";

import "./styles/sidebar.css";

import Thread from "./Thread";
import MessageBubble from "./MessageBubble";
import SubmitProblem from "./SubmitProblem";
import Notification from "./Notification";

type Props = {
  toggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  sideBarActivated: boolean;
  addBubble: React.Dispatch<React.SetStateAction<JSX.Element[]>>;
  setCurrentThreadName: React.Dispatch<React.SetStateAction<string>>;
  currentThreadName: string;
};
/**
 * SideBar component contains list of all threads
 * @param {function} toggleSideBar toggles SideBar component
 * @param {boolean} sideBarActivated represents the state of the SideBar component
 * @param {function} setWebSocket changes current WebSocket
 * @param {function} addBubble changes the MessageBubble List
 * @param {function} setCurrentThreadName changes current thread name
 * @param {string} currentThreadName represents the name of the current thread
 */

export default function SideBar({
  toggleSideBar,
  sideBarActivated,
  addBubble,
  setCurrentThreadName,
  currentThreadName,
}: Props) {
  const [submitProblemTextInput, changeSubmitProblemText] =
    useState<string>("");
  const [submitProblemActivated, toggleSubmitProblem] = useState(false);
  const [threads, addThread] = useState<JSX.Element[]>([]);

  // Thread list sync with localStorage, whenever current thread is changed
  useEffect(() => {
    addThread([]);
    for (let i = 0; i < localStorage.length; i++) {
      addThread((threads) => [
        ...threads,
        <Thread
          key={`thread-${threads.length + 1}`}
          problemName={localStorage.key(i)!}
          status={"resolving"}
          openThread={openThread}
        />,
      ]);
    }
  }, [currentThreadName]);

  useEffect(() => {
    toggleSideBar(!submitProblemActivated);
  }, [submitProblemActivated]);

  /**
   * Toggles SideBar and gets messages of the current thread.
   * @param {string} problemName name of the current thread
   */
  function openThread(problemName: string) {
    toggleSideBar((prev) => !prev);
    const currentThread = JSON.parse(localStorage.getItem(problemName)!);
    const threadMessages = [];
    for (let m = 0; m < currentThread.messages.length; m++) {
      threadMessages.push(
        <MessageBubble
          key={`message-${threadMessages.length + 1}`}
          text={currentThread.messages[m].text}
          type={currentThread.messages[m].sender}
          prevSender={m - 1 < 0 ? null : currentThread.messages[m - 1].sender}
        />
      );
    }
    addBubble(threadMessages.reverse());
    setCurrentThreadName(problemName);
  }

  /**
   * Toggles blur for the modal Popup Menu
   * @param {string} status represents the status of the modal blur
   */

  /**
   * Creates new thread if input is not empty, then pushes to localStorage
   */
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
  }

  return (
    <div>
      <div className="sidebar-wrapper">{threads}</div>
      <button
        className={sideBarActivated ? "add-button" : "add-button removed"}
        onClick={() => toggleSubmitProblem(true)}
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
      <Notification
        id={"submitProblem"}
        active={submitProblemActivated}
        toggleNotification={toggleSubmitProblem}
        blur={true}
      >
        <SubmitProblem
          changeText={changeSubmitProblemText}
          inputText={submitProblemTextInput}
          submitThread={submitThread}
        />
      </Notification>
    </div>
  );
}
