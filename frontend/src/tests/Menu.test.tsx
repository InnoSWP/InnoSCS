import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MenuPopup from "../components/Menu";

it("menu popup props and funcs test", () => {
  let popup = true;
  const togglePopup = jest.fn((value: boolean) => {
    popup = value;
  });
  const onClick = jest.fn();
  const optionsData = [
    {
      optionName: "test",
      onClick: () => onClick(),
    },
  ];

  const { rerender } = render(
    <MenuPopup
      active={popup}
      togglePopup={togglePopup}
      optionsData={optionsData}
      id="test-id"
    />
  );

  const popupWrapper = screen.getByTestId("popup-wrapper");
  const menuOption = screen.getByTestId("menu-option");

  expect(popupWrapper.className).toBe("popup-wrapper activated");

  fireEvent.click(popupWrapper);
  expect(togglePopup).toHaveBeenCalledTimes(2);
  expect(popup).toBe(false);

  rerender(
    <MenuPopup
      active={popup}
      togglePopup={togglePopup}
      optionsData={optionsData}
      id="test-id"
    />
  );

  expect(popupWrapper.className).toBe("popup-wrapper");

  fireEvent.click(menuOption);
  expect(onClick).toBeCalledTimes(1);
  expect(togglePopup).toHaveBeenCalledTimes(5);
});
