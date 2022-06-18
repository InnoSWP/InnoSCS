import { MouseEventHandler, useState, useEffect } from "react";
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
  togglePopup: Function;
  id: string;
};

export default function PopupMenu({
  optionsData,
  active,
  togglePopup,
  id,
}: PopupMenuProps) {
  const [modal, toggleModal] = useState<boolean>(false);
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

  useEffect(() => {
    if (modal) {
      togglePopup(true);
    }
  }, [modal, togglePopup]);

  return (
    <Modal id={id} isOpen={modal} onClose={() => togglePopup(false)}>
      <div
        className={active ? "popup-wrapper activated" : "popup-wrapper"}
        onClick={() => togglePopup(false)}
        onTransitionEnd={() => {
          if (!active) toggleModal(false);
        }}
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
    <div className="menu-option" onClick={onClick}>
      <span>{optionName}</span>
    </div>
  );
}
