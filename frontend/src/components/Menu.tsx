import { MouseEventHandler } from "react";
import Modal from "./Modal";
import "./styles/kebabMenu.css";
/**
 * KebabMenu component is a vertical dots button that toggles Popup Menu
 * @param {{optionsData: Array.<{optionName: string, onClick: function}>, active: boolean, togglePopup: function}} props
 * @param optionsData contains the information of the MenuOption
 * @param {boolean} active represents the state of the KebabMenu
 * @param {function} togglePopup opens/closes the Popup Menu
 */

type PopupMenuProps = {
  optionsData: {
    optionName: string;
    onClick: () => void;
  }[];
  active: boolean;
  togglePopup: (value: boolean) => void;
  id: string;
};

export default function PopupMenu({
  optionsData,
  active,
  togglePopup,
  id,
}: PopupMenuProps) {
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
    <Modal id={id} isOpen={false} onClose={() => togglePopup(false)}>
      <div
        data-testid="popup-wrapper"
        className={active ? "popup-wrapper activated" : "popup-wrapper"}
        onClick={() => togglePopup(false)}
      >
        <div className={id}>{options}</div>
      </div>
    </Modal>
  );
}

type MenuOptionProps = {
  optionName: string;
  onClick: MouseEventHandler<HTMLDivElement>;
};

function MenuOption({ onClick, optionName }: MenuOptionProps) {
  return (
    <div data-testid="menu-option" className="menu-option" onClick={onClick}>
      <span>{optionName}</span>
    </div>
  );
}
