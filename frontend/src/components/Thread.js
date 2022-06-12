export default function Thread(props) {
  return (
    <div className="thread-container">
      <div className={`status ${props.status}`}></div>
      <span>{props.problemName}</span>
    </div>
  );
}
