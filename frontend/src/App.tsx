import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";
import Notification from "./components/Notification";
import ProblemSolved from "./components/ProblemSolved";
import { useWebSocket } from "./components/WebSocket-Context";
import BackButton from "./components/BackButton";

/**
 * This component is a root of the application.
 */
function App() {
  const [sidebarActivated, toggleSideBar] = useState<boolean>(true); // toggles SideBar component
  const [problemSolvedActivated, toggleProblemSolved] = useState(false);
  const [messageBubbles, addBubble] = useState<JSX.Element[]>([]); // Messages of the current threads
  const [currentThreadName, setCurrentThreadName] = useState<string>(
    localStorage.key(0) === null ? "" : localStorage.key(0)!
  ); // Name of the current thread
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
  }, [problemSolvedActivated]);

  return (
    <div id="app">
      <Navbar key="navbar" toggleProblemSolved={toggleProblemSolved}>
        <BackButton active={sidebarActivated} toggle={toggleSideBar} />
      </Navbar>
      <SideBar
        key="sidebar"
        toggleSideBar={toggleSideBar}
        sideBarActivated={sidebarActivated}
        addBubble={addBubble}
        setCurrentThreadName={setCurrentThreadName}
        currentThreadName={currentThreadName}
      />
      <Messenger
        key="messenger"
        sidebarActivated={sidebarActivated}
        messageBubbles={messageBubbles}
        addBubble={addBubble}
        currentThreadName={currentThreadName}
      />
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
