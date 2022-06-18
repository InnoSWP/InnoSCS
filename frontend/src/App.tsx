import { useCallback, useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";
import Notification from "./components/Notification";
import ProblemSolved from "./components/ProblemSolved";

/**
 * This component is a root of the application.
 */
function App() {
  const [sidebarActivated, toggleSideBar] = useState<boolean>(true); // toggles SideBar component
  const [ws, setWebSocket] = useState(null);
  const [problemSolvedActivated, toggleProblemSolved] = useState(false);
  const [messageBubbles, addBubble] = useState<JSX.Element[]>([]); // Messages of the current threads
  const [currentThreadName, setCurrentThreadName] = useState<string>(
    localStorage.key(0) === null ? "" : localStorage.key(0)!
  ); // Name of the current thread

  /**
   * Closes {@link currentThreadName} thread
   *
   * If {@link currentThreadName} is empty (The current thread is not chosen), then nothing happens.
   */
  function closeCurrentThread() {
    if (currentThreadName !== "") {
      localStorage.removeItem(currentThreadName!);
      setCurrentThreadName("");
      toggleSideBar(true);
      addBubble([]);
    }
  }

  const toggleSideBarCallback = useCallback(toggleSideBar, [toggleSideBar]);
  const addBubbleCallback = useCallback(addBubble, [addBubble]);
  const setCurrentThreadNameCallback = useCallback(setCurrentThreadName, [
    setCurrentThreadName,
  ]);

  useEffect(() => {
    toggleSideBar(!problemSolvedActivated);
  }, [problemSolvedActivated]);

  return (
    <div id="app">
      <Navbar
        key="navbar"
        toggleSideBar={toggleSideBarCallback}
        sideBarActivated={sidebarActivated}
        toggleProblemSolved={toggleProblemSolved}
      />
      <SideBar
        key="sidebar"
        toggleSideBar={toggleSideBarCallback}
        sideBarActivated={sidebarActivated}
        addBubble={addBubbleCallback}
        setCurrentThreadName={setCurrentThreadNameCallback}
        currentThreadName={currentThreadName}
      />
      <Messenger
        key="messenger"
        sidebarActivated={sidebarActivated}
        messageBubbles={messageBubbles}
        addBubble={addBubbleCallback}
        currentThreadName={currentThreadName}
      />
      <Notification
        id={"problemSolved"}
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
