import React, { MouseEventHandler } from "react";
import ReactDOM from "react-dom";
/**
 * Modal component is a wrapper for Popup menus such as {@link KebabMenu} and {@link SubmitProblemNotification}
 * @param {{isOpen: boolean, onClose: function}} props
 * @param {boolean} isOpen a boolean value that represents the state of the Modal Window
 * @param {function} onClose a function that executes if the user clicks outside of the Popup Menu
 */

type Props = {
  id: string;
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
};

export default function Modal({ id, isOpen, onClose, children }: Props) {
  return ReactDOM.createPortal(
    <div
      className={"modal-container " + id + "-modal"}
      onClick={onClose}
      style={{ visibility: isOpen ? "visible" : "hidden" }}
    >
      {children}
    </div>,
    document.body
  );
}
