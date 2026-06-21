import {
  AlarmClockCheck,
  HeartPulse,
  BadgeCheck,
  Square,
  SquareCheckBig,
} from "lucide-react";
import { useState } from "react";

type CheckboxType = keyof typeof iconMap;

interface CheckboxProps {
  type: CheckboxType;
  time: string;
}
const iconMap = {
  awake: AlarmClockCheck,
  ready: BadgeCheck,
  alive: HeartPulse,
  checked: SquareCheckBig,
  unchecked: Square,
} as const;

export const Checkbox: React.FC<CheckboxProps> = ({ type, time }) => {
  const Icon = iconMap[type];
  const [checked, setChecked] = useState(false);
  const checkStatus: CheckboxType = checked ? "checked" : "unchecked";

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Icon size="32"></Icon>
        <div className="relative w-6 h-6" onClick={() => setChecked((p) => !p)}>
          <Square
            size={24}
            className={`absolute transition-all duration-300 ${
              checked ? "opacity-0 scale-80" : "opacity-100 scale-100"
            }`}
          />

          <SquareCheckBig
            size={24}
            className={`absolute transition-all duration-300 ${
              checked ? "opacity-100 scale-100" : "opacity-0 scale-80"
            }`}
          />
        </div>
        <p className="ml-auto">{time === "" ? "Time Not Set" : time}</p>
      </div>
    </>
  );
};
