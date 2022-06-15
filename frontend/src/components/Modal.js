import ReactDOM from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div id="modal" className="modal-container" onClick={onClose}>
      {children}
    </div>,
    document.body
  );
}
