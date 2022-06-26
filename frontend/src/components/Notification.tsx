import React, { useCallback, useEffect, useState } from "react";
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

  const toggleBlur = useCallback(
    (status: boolean) => {
      if (status)
        document
          .getElementsByClassName(`modal-container ${id}-modal`)!
          .item(0)
          ?.classList.add("blurred");
      else
        document
          .getElementsByClassName(`modal-container ${id}-modal`)!
          .item(0)
          ?.classList.remove("blurred");
    },
    [id]
  );

  useEffect(() => {
    if (active) {
      toggleModal(true);
    } else {
      toggleBlur(false);
      togglePopup(false);
    }
  }, [active, blur, toggleBlur]);

  useEffect(() => {
    if (modal) {
      if (blur) toggleBlur(true);
      togglePopup(true);
    }
  }, [modal, blur, toggleBlur]);

  return (
    <Modal
      id={id}
      isOpen={modal}
      onClose={() => {
        toggleBlur(false);
        toggleNotification(false);
      }}
    >
      <div className={"notification-wrapper " + id}>
        <div
          data-testid="notification-container"
          className={`notification-container ${popupActive ? "activated" : ""}`}
          onClick={(e) => e.stopPropagation()}
          onTransitionEnd={() => {
            if (!active) {
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