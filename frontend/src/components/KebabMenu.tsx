import { MouseEventHandler } from "react";
import "./styles/kebabMenu.css";
/**
 * KebabMenu component is a vertical dots button that toggles Popup Menu
 * @param {{optionsData: Array.<{optionName: string, onClick: function}>, active: boolean, togglePopup: function}} props
 * @param optionsData contains the information of the MenuOption
 * @param {boolean} active represents the state of the KebabMenu
 * @param {function} togglePopup opens/closes the Popup Menu
 */

type KebabMenuProps = {
  optionsData: {
    optionName: string,
    onClick: () => void;
  }[],
  active: boolean,
  togglePopup: Function
}

export default function KebabMenu({ optionsData, active, togglePopup }: KebabMenuProps) {
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

type MenuOptionProps = {
  optionName: string,
  onClick: MouseEventHandler<HTMLDivElement>
}

function MenuOption({onClick, optionName}: MenuOptionProps) {
  return (
    <div className="menu-option" onClick={onClick}>
      <span>{optionName}</span>
    </div>
  );
}
