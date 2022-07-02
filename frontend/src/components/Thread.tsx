/**
 * Thread component represents a separate chat for user/volunteer
 * @param {{problemName: string, status: string, openThread: function}} props
 * @param {string} problemName the name of the thread
 * @param {string} status current status of the thread (solved, solving, unsolved)
 * @param {function} openThread the openThread function that passed from {@link SideBar} component
 */

import { motion } from "framer-motion";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedThreadsState, threadDeletionState } from "./atoms";

type Props = {
  problemName: string;
  status: "resolving" | "resolved" | "unsolved";
  openThread: (problemName: string) => void;
  key?: string;
};

export default function Thread({
  problemName,
  status,
  openThread,
  key,
}: Props) {
  const threadDeletionActive = useRecoilValue(threadDeletionState);
  const [selectedThreads, setSelectedThreads] =
    useRecoilState(selectedThreadsState);

  const [checkboxState, toggleCheckbox] = useState(false);

  const selectThread = () => {
    if (!checkboxState) {
      setSelectedThreads((prev) => {
        if (!prev.includes(problemName)) return [...prev, problemName];
        return prev;
      });
    } else {
      setSelectedThreads((prev) => {
        const index = prev.indexOf(problemName);
        const newArray = Array.from(prev);
        if (index !== -1) {
          newArray.splice(index, 1);
          return newArray;
        }
        return prev;
      });
    }
    toggleCheckbox((prev) => !prev);

    console.log(selectedThreads);
  };
  const variants = {
    active: {
      x: 0,
      opacity: 1,
    },
    hidden: () => {
      toggleCheckbox(false);
      return { x: "100vw", opacity: 0 };
    },
  };
  return (
    <motion.div
      data-testid="thread-container"
      className="thread-container"
      onClick={() => openThread(problemName)}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      layout
    >
      <div
        data-testid="thread-status"
        className={`thread-status ${status}`}
      ></div>
      <span>{problemName}</span>
      <motion.div
        className="thread-checkbox-container"
        onClick={(e) => e.stopPropagation()}
        variants={variants}
        initial="hidden"
        animate={
          threadDeletionActive
            ? status !== "resolving"
              ? "active"
              : "hidden"
            : "hidden"
        }
        transition={{ duration: 0.5 }}
      >
        <input
          className="thread-checkbox"
          type="checkbox"
          onChange={selectThread}
          checked={checkboxState}
        />
      </motion.div>
    </motion.div>
  );
}
