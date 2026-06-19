import { Coins, UserRoundPen, Diff, Plus, Minus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MoneyTraderProps {
  name: string;
  balance: number;
  onNameChange: (newName: string) => void;
  onBalanceChange: (balanceChange: number) => void;
}

export const MoneyTrader: React.FC<MoneyTraderProps> = ({
  name,
  balance,
  onNameChange,
  onBalanceChange,
}) => {
  const [open, setOpen] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const [balanceColor, setBalanceColor] = useState("");
  const [balanceChange, setBalanceChange] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (balance === 0) setBalanceColor("text-white");
    else if (balance < 0) setBalanceColor("text-red-500");
    else if (balance > 0) setBalanceColor("text-green-500");
  }, [balance]);

  useEffect(() => {
    if (enableEdit) {
      inputRef.current?.focus();
    }
  }, [enableEdit]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleMouseDown);

    return () => {
      document.removeEventListener("click", handleMouseDown);
    };
  }, []);

  return (
    <div
      ref={popupRef}
      className="flex flex-col bg-gray-500 p-3 w-86 h-fit gap-2 rounded-xl"
    >
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-row gap-2 mr-auto">
          <UserRoundPen
            className="transition-all active:scale-95 active:opacity-60"
            onClick={() => {
              setEnableEdit(true);
            }}
          ></UserRoundPen>
          {enableEdit ? (
            <input
              className="size-full text-lg border-none outline-1 outline-white rounded-md p-1"
              value={name}
              ref={inputRef}
              onChange={(e) => onNameChange(e.target.value)}
              onBlur={() => {
                setEnableEdit(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEnableEdit(false);
                }
              }}
            ></input>
          ) : (
            <p className="text-lg">{name}</p>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Coins></Coins>
          <p className={`text-lg ${balanceColor}`}>{balance}₪</p>
          <Diff
            onClick={() => {
              setOpen((e) => !e);
            }}
            className="transition-all active:scale-95 active:opacity-60"
          ></Diff>
        </div>
      </div>
      {open && (
        <div className="flex flex-row justify-center gap-4">
          <Plus
            onClick={() => {
              onBalanceChange(balanceChange);
            }}
            className="transition-all active:scale-95 active:opacity-60"
          ></Plus>
          <input
            value={balanceChange === 0 ? "" : balanceChange}
            placeholder="0"
            onChange={(e) => setBalanceChange(parseFloat(e.target.value))}
            type="number"
            className="w-24 p-1 border-none outline-1 outline-gray-300 focus:outline-white rounded-sm"
          ></input>
          <Minus
            onClick={() => {
              onBalanceChange(-balanceChange);
            }}
            className="transition-all active:scale-95 active:opacity-60"
          ></Minus>
        </div>
      )}
    </div>
  );
};
