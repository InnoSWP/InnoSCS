import "./styles/messageBubble.css";
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
  prevSender: "message-bubble-volunteer" | "message-bubble-user" | null;
};

export default function MessageBubble({ text, type, prevSender }: Props) {
  const calculateMargin = () => {
    return prevSender === null ? 16 : prevSender === type ? 8 : 16; // the margin is being calculated depending on the previous sender
  };
  return (
    <div className={`${type}-wrapper`}>
      <div
        data-testid="message-bubble"
        className={type}
        style={{ marginTop: `${calculateMargin()}px` }}
      >
        <p>{text}</p>
      </div>
    </div>
  );
}
