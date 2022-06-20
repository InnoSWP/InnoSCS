import React from "react";
import "./styles/problemSolved.css";

type Props = {
  toggleNotification?: (value: boolean) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function ProblemSolved({
  toggleNotification,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <React.Fragment>
      <span className="notification-text">Is your Problem Solved?</span>
      <div className="problem-solved-buttons">
        <button
          className="no-button"
          onClick={() => {
            onCancel();
            toggleNotification!(false);
          }}
        >
          <span>No</span>
        </button>
        <button
          className="yes-button"
          onClick={() => {
            onSubmit();
            toggleNotification!(false);
          }}
        >
          <span>Yes</span>
        </button>
      </div>
    </React.Fragment>
  );
}
