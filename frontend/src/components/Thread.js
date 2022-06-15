export default function Thread({ problemName, status, openThread }) {
  return (
    <div className="thread-container" onClick={() => openThread(problemName)}>
      <div className={`thread-status ${status}`}></div>
      <span>{problemName}</span>
    </div>
  );
}
