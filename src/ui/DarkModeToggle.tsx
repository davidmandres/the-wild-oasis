import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import useDarkMode from "../context/useDarkMode.hooks";

export default function DarkModeToggle() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <ButtonIcon onClick={toggleDarkMode}>
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
}
