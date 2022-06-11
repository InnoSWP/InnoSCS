import "./styles/kebabMenu.css";
export default function KebabMenu(props) {
  const options = props.optionsData.map((opt) => (
    <MenuOption
      optionName={opt.optionName}
      onClick={() => {
        opt.onClick();
        props.togglePopup(false);
      }}
    />
  ));
  return (
    <div
      className={props.active ? "popup-wrapper activated" : "popup-wrapper"}
      onClick={() => props.togglePopup(false)}
    >
      <div className="kebab-menu">{options}</div>
    </div>
  );
}

function MenuOption(props) {
  return (
    <div className="menu-option" onClick={props.onClick}>
      <span>{props.optionName}</span>
    </div>
  );
}
