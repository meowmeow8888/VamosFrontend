import {
  HandCoins,
  MapPin,
  HomeIcon,
  AlarmClock,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router";

function MenuBar() {
  const iconStyle =
    "size-full p-3 transition-all active:scale-95 active:opacity-60";
  const nav = useNavigate();

  return (
    <div className="flex flex-row justify-center fixed bottom-0 left-0 w-full h-14">
      <MapPin
        className={iconStyle}
        onClick={() => {
          nav("/location");
        }}
      ></MapPin>
      <HandCoins
        className={iconStyle}
        onClick={() => {
          nav("/money");
        }}
      ></HandCoins>
      <HomeIcon
        className={iconStyle}
        onClick={() => {
          nav("/home");
        }}
      ></HomeIcon>
      <Utensils
        className={iconStyle}
        onClick={() => {
          nav("/restaurant");
        }}
      ></Utensils>
      <AlarmClock
        className={iconStyle}
        onClick={() => {
          nav("/alarm");
        }}
      ></AlarmClock>
    </div>
  );
}

export default MenuBar;
