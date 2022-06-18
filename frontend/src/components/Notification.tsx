import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import "./styles/notification.css";
type Props = {
  id: string;
  active: boolean;
  blur: boolean;
  toggleNotification: (value: boolean) => void;
  children: React.ReactNode;
};

export default function Notification({
  id,
  active,
  blur,
  toggleNotification,
  children,
}: Props) {
  const [modal, toggleModal] = useState(false);
  const [popupActive, togglePopup] = useState(false);
  const childrenWithToggle = React.Children.map(children, (child) => {
    if (React.isValidElement(child))
      return React.cloneElement(child, { ...child.props, toggleNotification });
  });

  function toggleBlur(status: boolean) {
    if (status)
      document
        .getElementsByClassName(`modal-container ${id}`)!
        .item(0)
        ?.classList.add("blurred");
    else
      document
        .getElementsByClassName(`modal-container ${id}`)!
        .item(0)
        ?.classList.remove("blurred");
  }

  useEffect(() => {
    if (active) {
      toggleModal(true);
    } else {
      togglePopup(false);
    }
  }, [active, blur]);

  useEffect(() => {
    if (modal) {
      if (blur) toggleBlur(true);
      togglePopup(true);
    }
  }, [modal]);

  return (
    <Modal
      id={id}
      isOpen={modal}
      onClose={() => {
        toggleBlur(false);
        toggleNotification(false);
      }}
    >
      <div className="notification-wrapper">
        <div
          className={`notification-container ${popupActive ? "activated" : ""}`}
          onClick={(e) => e.stopPropagation()}
          onTransitionEnd={() => {
            if (!active) {
              toggleBlur(false);
              toggleModal(false);
            }
          }}
        >
          {childrenWithToggle}
        </div>
      </div>
    </Modal>
  );
}
