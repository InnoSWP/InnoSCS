import ReactDOM from "react-dom";
/**
 * Modal component is a wrapper for Popup menus such as {@link KebabMenu} and {@link SubmitProblemNotification}
 * @param {{isOpen: boolean, onClose: function}} props
 * @param {boolean} isOpen a boolean value that represents the state of the Modal Window
 * @param {function} onClose a function that executes if the user clicks outside of the Popup Menu
 */
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div id="modal" className="modal-container" onClick={onClose}>
      {children}
    </div>,
    document.body
  );
}
