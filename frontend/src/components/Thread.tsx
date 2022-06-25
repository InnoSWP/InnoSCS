/**
 * Thread component represents a separate chat for user/volunteer
 * @param {{problemName: string, status: string, openThread: function}} props
 * @param {string} problemName the name of the thread
 * @param {string} status current status of the thread (solved, solving, unsolved)
 * @param {function} openThread the openThread function that passed from {@link SideBar} component
 */

type Props = {
  problemName: string;
  status: "resolving" | "resolved" | "unsolved";
  openThread: (problemName: string) => void;
};

export default function Thread({ problemName, status, openThread }: Props) {
  return (
    <div
      data-testid="thread-container"
      className="thread-container"
      onClick={() => openThread(problemName)}
    >
      <div
        data-testid="thread-status"
        className={`thread-status ${status}`}
      ></div>
      <span>{problemName}</span>
    </div>
  );
}
