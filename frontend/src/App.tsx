import { useState } from "react";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";

/**
 * This component is a root of the application.
 */
function App() {
  const [sidebarActivated, toggleSideBar] = useState<boolean>(true); // toggles SideBar component
  const [ws, setWebSocket] = useState<WebSocket>(new WebSocket('ws://localhost:0000/default_value'));
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

  return (
    <div id="app">
      <Navbar
        key="navbar"
        toggleSideBar={toggleSideBar}
        sideBarActivated={sidebarActivated}
        closeCurrentThread={closeCurrentThread}
      />
      <SideBar
        key="sidebar"
        toggleSideBar={toggleSideBar}
        sideBarActivated={sidebarActivated}
        addBubble={addBubble}
        setCurrentThreadName={setCurrentThreadName}
        currentThreadName={currentThreadName}
        setWebSocket={setWebSocket}
      />
      <Messenger
        key="messenger"
        webSocket={ws}
        sidebarActivated={sidebarActivated}
        messageBubbles={messageBubbles}
        addBubble={addBubble}
        currentThreadName={currentThreadName}
      />
    </div>
  );
}

export default App;
