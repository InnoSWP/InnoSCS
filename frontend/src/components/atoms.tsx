import { atom } from "recoil";

export const sidebarState = atom({
  key: "sidebarState",
  default: true,
});

export const currentThreadNameState = atom({
  key: "currentThreadNameState",
  default: localStorage.key(0) === null ? "" : localStorage.key(0)!,
});

export const messageBubblesState = atom<JSX.Element[]>({
  key: "messageBubblesState",
  default: [],
});

export const threadDeletionState = atom({
  key: "threadDeletionState",
  default: false,
});

export const threadsState = atom<JSX.Element[]>({
  key: "threadsState",
  default: [],
});

export const selectedThreadsState = atom<string[]>({
  key: "selectedThreadsState",
  default: [],
});

export const problemSolvedState = atom({
  key: "problemSolvedState",
  default: false,
});
