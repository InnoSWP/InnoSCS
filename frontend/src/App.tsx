import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Messenger from "./components/Messenger";

/**
 * This component is a root of the application.
 */
function App() {
  return (
    <div id="app">
      <Navbar key="navbar" />
      <SideBar key="sidebar" />
      <Messenger key="messenger" />
    </div>
  );
}

export default App;
