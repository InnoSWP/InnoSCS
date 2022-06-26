import { atom } from "recoil";

export const sidebarState = atom({
  key: "sidebarState",
  default: true,
});

export const currentThreadNameState = atom({
  key: "currentThreadNameState",
  default: localStorage.key(0) === null ? "" : localStorage.key(0)!,
});
