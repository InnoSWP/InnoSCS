import "./styles/main.css";
/**
 * Main component contains the list of messages for current thread
 * @param {{bubbles: MessageBubble[], messagesEndRef: Ref}} props
 * @param {MessageBubble[]} bubbles list of the messages
 * @param {Ref} messagesEndRef reference to the last message
 */

type Props = {
  bubbles: JSX.Element[];
  messagesEndRef: React.RefObject<any>;
};
export default function Main({ bubbles, messagesEndRef }: Props) {
  return (
    <div data-testid="message-container" className="message-container">
      <div
        data-testid="dummy-div"
        ref={messagesEndRef}
        className="dummy-div"
      ></div>
      {bubbles}
    </div>
  );
}
