import React, { MouseEventHandler } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  blur?: boolean;
};

export default function Modal({ id, isOpen, onClose, children, blur }: Props) {
  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-testid="modal-container"
          className={"modal-container " + id + "-modal"}
          onClick={onClose}
          initial={{ backdropFilter: "blur(0px) brightness(100%)" }}
          animate={blur && { backdropFilter: "blur(4px) brightness(90%)" }}
          exit={{ backdropFilter: "blur(0px) brightness(100%)" }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,

    document.body
  );
}
