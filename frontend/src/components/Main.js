import "./styles/main.css";
export default function Main(props) {
  return (
    <div className="message-container">
      <div ref={props.messagesEndRef} className="dummy-div"></div>
      {props.bubbles}
    </div>
  );
}
