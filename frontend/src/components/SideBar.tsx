import { useCallback, useEffect, useState } from "react";

import "./styles/sidebar.css";

import Thread from "./Thread";
import MessageBubble from "./MessageBubble";
import SubmitProblem from "./SubmitProblem";
import Notification from "./Notification";
import { useWebSocket } from "./WebSocket-Context";
import { WebSocketConfig } from "./config";
import { useRecoilState } from "recoil";
import { currentThreadNameState, sidebarState } from "./atoms";

type Props = {
  addBubble: (
    func: ((prev: JSX.Element[]) => JSX.Element[]) | JSX.Element[]
  ) => void;
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

export default function SideBar({ addBubble }: Props) {
  const [sideBarActivated, toggleSideBar] = useRecoilState(sidebarState);
  const [submitProblemTextInput, changeSubmitProblemText] =
    useState<string>("");
  const [submitProblemActivated, toggleSubmitProblem] =
    useState<boolean>(false);
  const [threads, addThread] = useState<JSX.Element[]>([]);
  const { dispatchWebSocket } = useWebSocket();
  const [currentThreadName, setCurrentThreadName] = useRecoilState(
    currentThreadNameState
  );

  /**
   * Creates Volunteer Bubble
   *
   * In current implementation is used for {@link webSocket} listener event
   */
  const createVolunteerBubble = useCallback(
    (event: MessageEvent<string>, threadName: string) => {
      const type = "message-bubble-volunteer";
      if (event.data) {
        const isCurrent = JSON.parse(localStorage.getItem(threadName)!).current;
        if (isCurrent) {
          addBubble((bubbles) => {
            return [
              <MessageBubble
                key={`message-${bubbles.length + 1}`}
                text={event.data}
                type={type}
                prevSender={bubbles.length === 0 ? null : bubbles[0].props.type}
              />,
              ...bubbles,
            ];
          });
        }

        var currentThread = JSON.parse(localStorage.getItem(threadName)!);
        currentThread.messages.push({ text: event.data, sender: type });
        localStorage.setItem(threadName, JSON.stringify(currentThread));
      }
    },
    [addBubble]
  );

  // TODO: rewrite using previous value of setCurrentThreadName function (GENIUS)
  const toggleCurrentThreadValue = (
    futureThread: string,
    previousThread: string
  ) => {
    const currentThread = JSON.parse(localStorage.getItem(futureThread)!);
    const prevThread =
      previousThread !== ""
        ? JSON.parse(localStorage.getItem(previousThread)!)
        : null;
    const currentThreadNew = { ...currentThread, current: true };
    localStorage.setItem(futureThread, JSON.stringify(currentThreadNew));
    if (prevThread !== null) {
      const prevThreadNew = { ...prevThread, current: false };
      localStorage.setItem(previousThread, JSON.stringify(prevThreadNew));
    }
  };

  /**
   * Toggles SideBar and gets messages of the current thread.
   * @param {string} problemName name of the current thread
   */
  const openThread = useCallback(
    (problemName: string) => {
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
      toggleCurrentThreadValue(problemName, currentThreadName);
      setCurrentThreadName(problemName);
    },
    [addBubble, toggleSideBar, setCurrentThreadName, currentThreadName]
  );

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
  }, [currentThreadName, openThread]);

  useEffect(() => {
    toggleSideBar(!submitProblemActivated);
  }, [submitProblemActivated, toggleSideBar]);

  const parseBigInt = async (response: Response) => {
    // !!! SCARY PARSING !!!
    const json_data = await response.text();
    const json_data2 = json_data.split(":");
    const id = json_data2[json_data2.length - 1].replace("}", "");
    return id;
    // !!! SCARY PARSING !!!
  };

  const fetchData = async () => {
    const response = await fetch(
      `http://${WebSocketConfig.address}:${WebSocketConfig.port}/threads/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ question: submitProblemTextInput }),
      }
    );
    return parseBigInt(response);
  };

  /**
   * Creates new thread if input is not empty, then pushes to localStorage
   */
  function submitThread() {
    if (submitProblemTextInput !== "") {
      fetchData().then((t) => {
        const newThread = {
          status: "resolving",
          messages: [],
          id: t,
          current: false,
        };
        localStorage.setItem(submitProblemTextInput, JSON.stringify(newThread));

        dispatchWebSocket({
          type: "CONNECT",
          thread_name: submitProblemTextInput,
          func: createVolunteerBubble,
        });
      });

      addThread((threads) => {
        const newThreadElement = (
          <Thread
            key={`thread-${threads.length + 1}`}
            problemName={submitProblemTextInput}
            status={"resolving"}
            openThread={openThread}
          />
        );

        return [...threads, newThreadElement];
      });
    }
  }

  return (
    <div>
      <div className="sidebar-wrapper">{threads}</div>
      <button
        data-testid="add-button"
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
        id="submitProblem"
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
