import Modal from "./Modal";
import Thread from "./Thread";
import SubmitProblemNotification from "./SubmitProblemNotification";
import { useEffect, useState } from "react";
import "./styles/sidebar.css";
export default function SideBar({ toggleSideBar, sideBarActivated }) {
  const [submitProblemTextInput, changeSubmitProblemText] = useState("");
  const [modalActivated, toggleModal] = useState(false);
  const [submitProblemActivated, toggleSubmitProblem] = useState(false);
  const [threads, addThread] = useState([
    <Thread key="thread-1" problemName={"Lorem ipsum"} status={"resolving"} />,
    <Thread
      key="thread-2"
      problemName={"Some other problem"}
      status={"solved"}
    />,
    <Thread
      key="thread-3"
      problemName={"Some new problem"}
      status={"unsolved"}
    />,
  ]);

  function toggleBlur(status) {
    if (document.getElementById("modal") !== undefined) {
      if (status) document.getElementById("modal").classList.add("blurred");
      else document.getElementById("modal").classList.remove("blurred");
    }
  }

  function createThread() {
    toggleModal((prev) => !prev);
  }
  // TODO: change it later
  useEffect(() => {
    if (modalActivated !== false) {
      toggleSideBar((prev) => !prev);
      toggleBlur(true);
      toggleSubmitProblem((prev) => !prev);
    }
  }, [modalActivated]);

  function submitThread() {
    if (submitProblemTextInput !== "") {
      addThread((threads) => [
        ...threads,
        <Thread
          key={`thread-${threads.length + 1}`}
          problemName={submitProblemTextInput}
          status={"resolving"}
        />,
      ]);
    }

    toggleSubmitProblem((prev) => !prev);
    toggleBlur(false);
    toggleSideBar((prev) => !prev);
    changeSubmitProblemText("");
    // TODO: change it later
    setTimeout(() => {
      toggleModal((prev) => !prev);
    }, 500);
  }

  return (
    <div>
      <div className="sidebar-wrapper">{threads}</div>
      <button
        className={sideBarActivated ? "add-button" : "add-button removed"}
        onClick={createThread}
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
      <Modal isOpen={modalActivated}>
        <SubmitProblemNotification
          changeText={changeSubmitProblemText}
          inputText={submitProblemTextInput}
          show={submitProblemActivated}
          submitThread={submitThread}
        />
      </Modal>
    </div>
  );
}
