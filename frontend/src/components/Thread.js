export default function Thread(props) {
  const thread_id = props.thread_id;
  return (
    <div className="thread-container">
      <div className={`status ${props.status}`}></div>
      <span>{props.problemName}</span>
    </div>
  );
}
