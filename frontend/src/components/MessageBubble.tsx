import "./styles/messageBubble.css";
import { motion } from "framer-motion";
/**
 * MessageBubble component is a gray/blue container with message of the sender
 * @param {{text: string, type: string, prevSender: string}} props
 * @param {string} text text of the message
 * @param {string} type sender of the message
 * @param {string} prevSender previous sender of the message, is being used for correct margin
 */

type Props = {
  text: string;
  type: "message-bubble-volunteer" | "message-bubble-user";
  prevSender: "message-bubble-volunteer" | "message-bubble-user";
};

export default function MessageBubble({ text, type, prevSender }: Props) {
  const calculateMargin = () => {
    return prevSender === null ? 16 : prevSender === type ? 8 : 16; // the margin is being calculated depending on the previous sender
  };
  return (
    <motion.div
      className={`${type}-wrapper`}
      initial={{ opacity: 0, y: 100, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "min-content" }}
      transition={{ duration: 0.25 }}
    >
      <div
        data-testid="message-bubble"
        className={type}
        style={{ marginTop: `${calculateMargin()}px` }}
      >
        <p>{text}</p>
      </div>
    </motion.div>
  );
}
