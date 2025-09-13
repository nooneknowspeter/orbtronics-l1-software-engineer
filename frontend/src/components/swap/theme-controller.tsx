import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeController() {
  return (
    <label className="swap swap-rotate">
      <input type="checkbox" className="theme-controller" value="light" />

      <FaSun className="swap-off fill-current" />

      <FaMoon className="swap-on fill-current" />
    </label>
  );
}
