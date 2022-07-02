import React from "react";
import "./styles/problemSolved.css";
import Notification from "./Notification";

type Props = {
  toggle: (value: boolean) => void;
  active: boolean;
  onCancel: (status: string) => void;
  onSubmit: (status: string) => void;
};

export default function ProblemSolved({
  toggle,
  onCancel,
  onSubmit,
  active,
}: Props) {
  return (
    <Notification
      id="problem-solved"
      toggle={toggle}
      active={active}
      blur={true}
    >
      <span className="notification-text">Is your Problem Solved?</span>
      <div className="problem-solved-buttons">
        <button
          data-testid="no-button"
          className="no-button"
          onClick={() => {
            onCancel("unsolved");
            toggle(false);
          }}
        >
          <span>No</span>
        </button>
        <button
          data-testid="yes-button"
          className="yes-button"
          onClick={() => {
            onSubmit("resolved");
            toggle!(false);
          }}
        >
          <span>Yes</span>
        </button>
      </div>
    </Notification>
  );
}
