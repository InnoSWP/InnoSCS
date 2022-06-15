import "./styles/messageBubble.css";
export default function MessageBubble({ text, type, prevSender }) {
  const flexibleMargin =
    prevSender === null ? 16 : prevSender === type ? 8 : 16;
  return (
    <div className={`${type}-wrapper`}>
      <div className={type} style={{ marginTop: `${flexibleMargin}px` }}>
        <p>{text}</p>
      </div>
    </div>
  );
}
