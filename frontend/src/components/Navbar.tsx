import React, { useState } from "react";

import "./styles/navbar.css";

import PopupMenu from "./PopupMenu";
import BackButton from "./BackButton";

import { useRecoilState } from "recoil";
import { sidebarState } from "./atoms";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Navbar component is a header of the application. It contains back-button that toggles SideBar, KebabMenu and status of the Customer Support.
 * @param {{sideBarActivated: boolean, toggleSideBar: function, closeCurrentThread: function}} props
 * @param {boolean} sideBarActivated represents the state of the SideBar component
 * @param {function} toggleSideBar function that changes the state of the SideBar component
 * @param {function} closeCurrentThread function that closes the current thread
 */

type Props = {
  toggleProblemSolved: (value: boolean) => void;
};

export default function Navbar({ toggleProblemSolved }: Props) {
  const [menuActivated, toggleMenuPopup] = useState<boolean>(false);
  const [sidebarActivated, toggleSideBar] = useRecoilState(sidebarState);

  // KebabMenu config
  // TODO: add functionality to <Settings> and <Change Volunteer>
  const opts = [
    {
      optionName: "Close thread",
      onClick: () => toggleProblemSolved(true),
    },
    {
      optionName: "Settings",
      onClick: () => console.log("Settings opened"),
    },
    {
      optionName: "Change Volunteer",
      onClick: () => console.log("Volunteer changed"),
    },
  ];

  const variants = {
    hamburger: {
      width: 28,
      x: 0,
      rx: 1.9553,
      height: 3.2,
    },

    kebab: {
      width: 3.76923,
      x: 9.84613,
      rx: 1.88462,
      height: 3.91061,
    },
  };

  return (
    <nav>
      <div className="navbar-wrapper">
        <div className="button-back-container">
          <BackButton active={sidebarActivated} toggle={toggleSideBar} />
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
          onClick={() => toggleMenuPopup(true)}
        >
          <motion.svg
            className="button-menu-svg"
            width="28"
            height="22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.rect
              variants={variants}
              animate={sidebarActivated ? "hamburger" : "kebab"}
              transition={{ duration: 0.5 }}
              y="18.0894"
              fill="black"
            />
            <motion.rect
              variants={variants}
              animate={sidebarActivated ? "hamburger" : "kebab"}
              transition={{ duration: 0.4 }}
              y="10.04468"
              fill="black"
            />
            <motion.rect
              variants={variants}
              animate={sidebarActivated ? "hamburger" : "kebab"}
              transition={{ duration: 0.3 }}
              fill="black"
              y="2"
            />
          </motion.svg>
        </button>
      </div>
      <PopupMenu
        key="kebab-menu"
        id="kebab-menu"
        active={menuActivated}
        togglePopup={toggleMenuPopup}
        optionsData={opts}
      />
    </nav>
  );
}
