import React, { useState } from "react";

import "./styles/navbar.css";

import PopupMenu from "./PopupMenu";
import BackButton from "./BackButton";

import { useRecoilState } from "recoil";
import {
  messageBubblesState,
  problemSolvedState,
  selectedThreadsState,
  sidebarState,
  threadDeletionState,
  threadsState,
} from "./atoms";
import { motion } from "framer-motion";

/**
 * Navbar component is a header of the application. It contains back-button that toggles SideBar, KebabMenu and status of the Customer Support.
 * @param {{sideBarActivated: boolean, toggleSideBar: function, closeCurrentThread: function}} props
 * @param {boolean} sideBarActivated represents the state of the SideBar component
 * @param {function} toggleSideBar function that changes the state of the SideBar component
 * @param {function} closeCurrentThread function that closes the current thread
 */

export default function Navbar() {
  const [menuActive, toggleMenuPopup] = useState<boolean>(false);
  const [sidebarActive, toggleSideBar] = useRecoilState(sidebarState);
  const [threadDeletionActive, toggleThreadDeletion] =
    useRecoilState(threadDeletionState);
  const [, setThreads] = useRecoilState(threadsState);
  const [, toggleProblemSolved] = useRecoilState(problemSolvedState);
  const [, setMessageBubbles] = useRecoilState(messageBubblesState);
  const [selectedThreads, setSelectedThreads] =
    useRecoilState(selectedThreadsState);

  // KebabMenu config
  const kebabOpts = [
    {
      optionName: "Close thread",
      onClick: () => toggleProblemSolved(true),
    },
  ];
  // Hamburger config
  const hamburgerOpts = [
    {
      optionName: "Delete thread",
      onClick: () => {
        setSelectedThreads([]);
        toggleThreadDeletion(true);
      },
    },
  ];

  const variants = {
    hamburger: {
      width: 28,
      x: 0,
      rx: 1.9553,
      height: 3.2,
      opacity: 1,
    },

    kebab: {
      width: 3.76923,
      x: 9.84613,
      rx: 1.88462,
      height: 3.91061,
      opacity: 1,
    },

    cross_top: {
      rotate: "45deg",
      translateY: 8,
    },

    cross_middle: {
      opacity: 0,
    },

    cross_bottom: {
      rotate: "-45deg",
      translateY: -8,
      translateX: -2,
    },
  };

  function deleteThreads() {
    console.log("Deleted: ", selectedThreads);
    if (selectedThreads.length > 0) {
      for (let threadName of selectedThreads) {
        setThreads((prev) => {
          let index = -1;
          const newThreads = Array.from(prev);
          for (let i = 0; i < newThreads.length; i++) {
            if (newThreads[i].props.problemName === threadName) {
              index = i;
              break;
            }
          }

          if (index !== -1) {
            newThreads.splice(index, 1);
            return newThreads;
          }
          return prev;
        });
        localStorage.removeItem(threadName);
      }
      setSelectedThreads([]);
      toggleSideBar(true);
      setMessageBubbles([]);
    }
  }

  return (
    <nav>
      <div className="navbar-wrapper">
        <div className="button-back-container">
          <BackButton
            active={!sidebarActive || threadDeletionActive}
            toggle={
              threadDeletionActive
                ? (value: boolean) => toggleThreadDeletion(!value)
                : toggleSideBar
            }
          />
        </div>
        <div className="title-container">
          <span className="title-text">Customer Support</span>
          <span className="title-status">Online</span>
        </div>
      </div>

      <div className="button-menu-container">
        <button
          data-testid="button-menu"
          className="button-menu"
          onClick={() => {
            if (threadDeletionActive) {
              toggleThreadDeletion(false);
              deleteThreads();
            } else toggleMenuPopup(true);
          }}
        >
          <motion.svg
            className="button-menu-svg"
            width="28"
            height="28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.rect
              key="menu-bottom"
              variants={variants}
              y="18.0894"
              style={{ originX: "14", originY: "18.0894" }}
              animate={
                sidebarActive
                  ? threadDeletionActive
                    ? "cross_bottom"
                    : "hamburger"
                  : "kebab"
              }
              transition={{ duration: 0.5 }}
              fill="black"
            />
            <motion.rect
              key="menu-middle"
              variants={variants}
              y="10.04468"
              animate={
                sidebarActive
                  ? threadDeletionActive
                    ? "cross_middle"
                    : "hamburger"
                  : "kebab"
              }
              transition={{ duration: 0.4 }}
              fill="black"
            />
            <motion.rect
              key="menu-top"
              variants={variants}
              y="2"
              style={{ originX: "14", originY: "2" }}
              animate={
                sidebarActive
                  ? threadDeletionActive
                    ? "cross_top"
                    : "hamburger"
                  : "kebab"
              }
              transition={{ duration: 0.3 }}
              fill="black"
            />
          </motion.svg>
        </button>
      </div>
      <PopupMenu
        key="kebab-menu"
        id="kebab-menu"
        active={menuActive}
        togglePopup={toggleMenuPopup}
        optionsData={sidebarActive ? hamburgerOpts : kebabOpts}
      />
    </nav>
  );
}
