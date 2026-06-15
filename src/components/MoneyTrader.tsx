import { Coins, UserRoundPen, Diff } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";

interface MoneyTraderProps {
  name: string;
  balance: number;
}

export const MoneyTrader: React.FC<MoneyTraderProps> = ({ name, balance }) => {
  const [selected, setSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [enableEdit, setEnableEdit] = useState(false);
  const [balanceColor, setBalanceColor] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (balance === 0) setBalanceColor("text-white");
    else if (balance < 0) setBalanceColor("text-red-500");
    else if (balance > 0) setBalanceColor("text-green-500");
  }, [balance]);

  useEffect(() => {
    if (enableEdit) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [enableEdit]);

  return (
    <div>
      <div
        className="flex flex-row justify-center items-center
    bg-gray-500 p-3 w-86 h-12 gap-2 rounded-xl"
      >
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
          <Diff></Diff>
        </div>
      </div>
      {open && (
        <input
          type="number"
          placeholder={selected ? "0.00" : ""}
          className="w-24 p-1 border-none outline-1 outline-gray-300 focus:outline-white rounded-sm"
        ></input>
      )}
    </div>
  );
};
