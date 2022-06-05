import "./styles/messageBubble.css";
export default function MessageBubble(props) {
  const message_text = props.text;
  const message_type = props.type;
  const message_margin_bottom = props.flexibleMargin;
  return (
    <div className={`${message_type}-wrapper`}>
      <div
        className={message_type}
        style={{ marginTop: message_margin_bottom + "px" }}
      >
        <p>{message_text}</p>
      </div>
    </div>
  );
}
