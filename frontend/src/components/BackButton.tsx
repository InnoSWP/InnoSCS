type Props = {
  active: boolean;
  toggle: (func: (value: boolean) => boolean) => void;
};
export default function BackButton({ active, toggle }: Props) {
  return (
    <button
      className={active ? "button-back rotated" : "button-back"}
      onClick={() => toggle((prev) => !prev)}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.6666 9.66667V12.3333H5.66663L13 19.6667L11.1066 21.56L0.546631 11L11.1066 0.440002L13 2.33334L5.66663 9.66667H21.6666Z"
          fill="black"
        />
      </svg>
    </button>
  );
}
