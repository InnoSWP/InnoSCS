import "./styles/navbar.css";
export default function Navbar(props) {
  return (
    <nav>
      <div className="navbar-wrapper">
        <div className="button-back-container">
          <button
            className="button-back"
            onClick={() => props.toggleSideBar((prev) => !prev)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.6666 9.66667V12.3333H5.66663L13 19.6667L11.1066 21.56L0.546631 11L11.1066 0.440002L13 2.33334L5.66663 9.66667H21.6666Z"
                fill="black"
              />
            </svg>
          </button>
        </div>

        <div className="title-container">
          <span className="title-text">Customer Support</span>
          <span className="title-status">Online</span>
        </div>
      </div>

      <div className="button-menu-container">
        <button className="button-menu">
          <svg
            width="6"
            height="22"
            viewBox="0 0 6 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.99998 16.3333C3.70722 16.3333 4.3855 16.6143 4.8856 17.1144C5.38569 17.6145 5.66665 18.2927 5.66665 19C5.66665 19.7072 5.38569 20.3855 4.8856 20.8856C4.3855 21.3857 3.70722 21.6666 2.99998 21.6666C2.29274 21.6666 1.61446 21.3857 1.11436 20.8856C0.614265 20.3855 0.333313 19.7072 0.333313 19C0.333313 18.2927 0.614265 17.6145 1.11436 17.1144C1.61446 16.6143 2.29274 16.3333 2.99998 16.3333ZM2.99998 8.33331C3.70722 8.33331 4.3855 8.61427 4.8856 9.11436C5.38569 9.61446 5.66665 10.2927 5.66665 11C5.66665 11.7072 5.38569 12.3855 4.8856 12.8856C4.3855 13.3857 3.70722 13.6666 2.99998 13.6666C2.29274 13.6666 1.61446 13.3857 1.11436 12.8856C0.614265 12.3855 0.333313 11.7072 0.333313 11C0.333313 10.2927 0.614265 9.61446 1.11436 9.11436C1.61446 8.61427 2.29274 8.33331 2.99998 8.33331ZM2.99998 0.333313C3.70722 0.333313 4.3855 0.614264 4.8856 1.11436C5.38569 1.61446 5.66665 2.29274 5.66665 2.99998C5.66665 3.70722 5.38569 4.3855 4.8856 4.8856C4.3855 5.38569 3.70722 5.66665 2.99998 5.66665C2.29274 5.66665 1.61446 5.38569 1.11436 4.8856C0.614265 4.3855 0.333313 3.70722 0.333313 2.99998C0.333313 2.29274 0.614265 1.61446 1.11436 1.11436C1.61446 0.614264 2.29274 0.333313 2.99998 0.333313Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
