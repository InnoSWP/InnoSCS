import { useEffect } from "react";
import { RecoilState, useRecoilState, useRecoilValue } from "recoil";
import {
  currentThreadNameState,
  messageBubblesState,
  sidebarState,
} from "../components/atoms";

type RecoilObserverProps = {
  node: RecoilState<any>;
  onChange: Function;
};

export const RecoilObserver = ({ node, onChange }: RecoilObserverProps) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

type RecoilStateHelperProps = {
  sidebarActivated: boolean;
  messageBubbles: JSX.Element[];
  currentThreadName: string;
};
export const RecoilTestHelper = ({
  sidebarActivated,
  messageBubbles,
  currentThreadName,
}: RecoilStateHelperProps) => {
  const [, toggleSideBar] = useRecoilState(sidebarState);
  const [, addBubble] = useRecoilState(messageBubblesState);
  const [, setCurrentThreadName] = useRecoilState(currentThreadNameState);
  toggleSideBar(sidebarActivated);
  addBubble(messageBubbles);
  setCurrentThreadName(currentThreadName);
  return <div></div>;
};
