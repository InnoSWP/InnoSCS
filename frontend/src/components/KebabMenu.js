import "./styles/kebabMenu.css";
/**
 * KebabMenu component is a vertical dots button that toggles Popup Menu
 * @param {{optionsData: Array.<{optionName: string, onClick: function}>, active: boolean, togglePopup: function}} props
 * @param optionsData contains the information of the MenuOption
 * @param {boolean} active represents the state of the KebabMenu
 * @param {function} togglePopup opens/closes the Popup Menu
 */
export default function KebabMenu({ optionsData, active, togglePopup }) {
  const options = optionsData.map((opt) => (
    <MenuOption
      key={opt.optionName}
      optionName={opt.optionName}
      onClick={() => {
        opt.onClick();
        togglePopup(false);
      }}
    />
  ));
  return (
    <div
      className={active ? "popup-wrapper activated" : "popup-wrapper"}
      onClick={() => togglePopup(false)}
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
