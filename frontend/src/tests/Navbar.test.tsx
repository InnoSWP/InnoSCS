import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { RecoilRoot } from "recoil";

it("toggle menu popup test", () => {
  render(
    <RecoilRoot>
      <Navbar />
    </RecoilRoot>
  );

  // const buttonMenu = screen.getByTestId("button-menu");
  // const menuOptions = screen.getAllByTestId("menu-option");

  // fireEvent.click(buttonMenu);

  // for (let i = 0; i < menuOptions.length; i++) {
  //   fireEvent.click(menuOptions[i]);
  // }

  // expect(toggleProblemSolved).toBeCalled();
});
