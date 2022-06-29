import React from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import "./styles/notification.css";
type Props = {
  id: string;
  active: boolean;
  blur: boolean;
  toggle: (value: boolean) => void;
  children: React.ReactNode;
};

export default function Notification({
  id,
  active,
  blur,
  toggle,
  children,
}: Props) {
  return (
    <Modal id={id} isOpen={active} onClose={() => toggle(false)} blur={blur}>
      <motion.div
        className="notification-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="notification-container"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </motion.div>
    </Modal>
  );
}
