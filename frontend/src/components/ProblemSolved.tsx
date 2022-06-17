import React from "react";
import "./problemSolved.css";

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
};

export default function ProblemSolved({ onCancel, onSubmit }: Props) {
  return (
    <React.Fragment>
      <span className="notification-text">Is your Problem Solved?</span>
      <div className="problem-solved-buttons">
        <button className="no-button" onClick={onCancel}>
          <span>No</span>
        </button>
        <button className="yes-button" onClick={onSubmit}>
          <span>Yes</span>
        </button>
      </div>
    </React.Fragment>
  );
}
