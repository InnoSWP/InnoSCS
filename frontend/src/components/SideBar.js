import "./styles/sidebar.css";
export default function SideBar(props) {
  return (
    <div>
      <div className="sidebar-wrapper">{props.threads}</div>
      <button
        className={props.sideBarActivated ? "add-button" : "add-button removed"}
        onClick={props.createThread}
      >
        <svg
          width="46"
          height="46"
          viewBox="0 0 46 46"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36.3333 24.9048H24.9048V36.3334H21.0952V24.9048H9.66666V21.0953H21.0952V9.66669H24.9048V21.0953H36.3333V24.9048Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}
