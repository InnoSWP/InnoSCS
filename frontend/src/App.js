import { useState } from "react";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";

/**
 * This component is a root of the application.
 */
function App() {
  const [sidebarActivated, toggleSideBar] = useState(true); // toggles SideBar component
  const [ws, setWebSocket] = useState(null); // WebSocket state
  const [messageBubbles, addBubble] = useState([]); // Messages of the current threads
  const [currentThreadName, setCurrentThreadName] = useState(
    localStorage.key(0)
  ); // Name of the current thread

  /**
   * Closes {@link currentThreadName} thread
   *
   * If {@link currentThreadName} is empty (The current thread is not chosen), then nothing happens.
   */
  function closeCurrentThread() {
    if (currentThreadName !== "") {
      localStorage.removeItem(currentThreadName);
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
