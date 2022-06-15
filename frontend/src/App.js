import { useState, useEffect } from "react";

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
