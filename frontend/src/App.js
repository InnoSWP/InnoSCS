import { useState } from "react";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";

function App() {
  const [sidebarActivated, toggleSideBar] = useState(true);
  const [ws, setWebSocket] = useState(null);
  const [messageBubbles, addBubble] = useState([]);
  const [currentThreadName, setCurrentThreadName] = useState(
    localStorage.key(0)
  );

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
