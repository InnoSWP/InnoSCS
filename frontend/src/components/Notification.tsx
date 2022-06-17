import "./styles/notification.css"
type Props = {
  show: boolean,
  children: React.ReactNode
}

export default function Notification({show, children}: Props) {

  return (
    <div className="notification-wrapper">
      <div className={`notification-container ${show ? "activated" : ""}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}