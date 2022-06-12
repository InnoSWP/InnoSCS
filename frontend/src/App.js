import Navbar from "./components/Navbar";
import { useState } from "react";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";

function App() {
  const [sidebarActivated, toggleSideBar] = useState(false);

  return (
    <div id="app">
      <Navbar
        key="navbar"
        toggleSideBar={toggleSideBar}
        sideBarActivated={sidebarActivated}
      />
      <SideBar
        key="sidebar"
        toggleSideBar={toggleSideBar}
        sideBarActivated={sidebarActivated}
      />
      <Messenger sidebarActivated={sidebarActivated} />
    </div>
  );
}

export default App;
