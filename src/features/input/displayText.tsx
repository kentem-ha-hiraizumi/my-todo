import { useInputAtom } from "./inputAtom";

export const DisplayText = () => {
  const { displayText } = useInputAtom();

  return <h2 className="font-bold text-2xl text-sky-700">{displayText}</h2>;
};
