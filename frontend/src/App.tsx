import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";
import Notification from "./components/Notification";
import ProblemSolved from "./components/ProblemSolved";
import { useWebSocket } from "./components/WebSocket-Context";
import { useRecoilState } from "recoil";
import {
  currentThreadNameState,
  messageBubblesState,
  sidebarState,
} from "./components/atoms";

/**
 * This component is a root of the application.
 */
function App() {
  const [, toggleSideBar] = useRecoilState(sidebarState);
  const [problemSolvedActivated, toggleProblemSolved] = useState(false);
  const [, addBubble] = useRecoilState(messageBubblesState); // Messages of the current threads
  const [currentThreadName, setCurrentThreadName] = useRecoilState(
    currentThreadNameState
  );
  const { dispatchWebSocket } = useWebSocket();

  /**
   * Closes {@link currentThreadName} thread
   *
   * If {@link currentThreadName} is empty (The current thread is not chosen), then nothing happens.
   */
  function closeCurrentThread() {
    if (currentThreadName !== "") {
      dispatchWebSocket({
        type: "CLOSE",
        thread_name: currentThreadName,
      });
      localStorage.removeItem(currentThreadName!);
      setCurrentThreadName("");
      toggleSideBar(true);
      addBubble([]);
    }
  }

  useEffect(() => {
    toggleSideBar(!problemSolvedActivated);
  }, [problemSolvedActivated, toggleSideBar]);

  return (
    <div id="app">
      <Navbar key="navbar" toggleProblemSolved={toggleProblemSolved} />
      <SideBar key="sidebar" />
      <Messenger key="messenger" />
      <Notification
        id="problemSolved"
        active={problemSolvedActivated}
        toggleNotification={toggleProblemSolved}
        blur={true}
      >
        <ProblemSolved
          onCancel={() => console.log("No")}
          onSubmit={closeCurrentThread}
        />
      </Notification>
    </div>
  );
}

export default App;
