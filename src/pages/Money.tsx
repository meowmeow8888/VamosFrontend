import { useEffect, useMemo, useState } from "react";
import { History, ClockArrowDown } from "lucide-react";
import MenuBar from "../components/menuBar";
import { MoneyTrader } from "../components/Money/MoneyTrader";
import { BASE_URL } from "../utils/constants";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";

export interface Friend {
  id: number;
  name: string;
  balance: number;
  nickname: string;
}

interface Transaction {
  receiverId: number;
  amount: number;
}

function Money() {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const saved = localStorage.getItem("friends");

    if (!saved || saved === "undefined") {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Failed to parse friends from localStorage:", error);
      return [];
    }
  });
  const [txQueue, setTxQueue] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("txQueue");

    if (!saved || saved === "undefined") {
      return [];
    }

    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Failed to parse friends from localStorage:", error);
      return [];
    }
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [totalBalanceColor, setTotalBalanceColor] = useState("");
  const totalBalance = useMemo(() => {
    return friends.reduce((total, friend) => total + friend.balance, 0);
  }, [friends]);
  const { userId } = useAuth();
  const nav = useNavigate();

  const getFriends = async () => {
    const res = await fetch(`${BASE_URL}/api/friends`, {
      credentials: "include",
    });
    const data = await res.json();
    const updatedFriends = data.friends.map((friend: Friend) => ({
      id: friend.id,
      name: friend.name,
      balance: friend.balance,
      nickname: friend.nickname,
    }));

    setFriends(updatedFriends);
  };

  const commitTransactions = async () => {
    const tx = txQueue[0];
    if (tx) {
      await fetch(`${BASE_URL}/api/create-transaction`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tx),
      });
      setTxQueue((prev) => prev.slice(1));
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    setFriends((prev) =>
      prev.map((friend, i) =>
        i === index ? { ...friend, nickname: newName } : friend,
      ),
    );
  };

  const sendNickname = async (index: number) => {
    await fetch(`${BASE_URL}/api/nickname`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickerId: userId,
        nickedId: friends.at(index)?.id,
        nickname: friends.at(index)?.nickname,
      }),
    });
  };

  const updateBalance = (index: number, balanceChange: number) => {
    friends.map((friend, i) => {
      if (i === index) {
        const newTx: Transaction = {
          receiverId: friend.id,
          amount: balanceChange,
        };
        setTxQueue((prev) => [...prev, newTx]);
      }
    });
  };

  useEffect(() => {
    if (totalBalance === 0) setTotalBalanceColor("text-white");
    else if (totalBalance < 0) setTotalBalanceColor("text-red-500");
    else if (totalBalance > 0) setTotalBalanceColor("text-green-500");
  }, [totalBalance]);

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem("txQueue", JSON.stringify(txQueue));
    if (txQueue.length === 0) return;
    commitTransactions();
  }, [txQueue]);

  return (
    <>
      <div className="h-[calc(100vh-3.5rem)] overflow-y-auto pb-12">
        <div className="flex flex-row justify-between items-center m-4 ">
          <History className="bg-gray-500 rounded-2xl p-2 size-12"></History>
          <div className="flex flex-row items-center bg-gray-500 rounded-2xl p-2 gap-2">
            <p className="text-xl">Total Balance:</p>
            <p className={`text-xl ${totalBalanceColor}`}>
              {totalBalance.toFixed(1)}₪
            </p>
          </div>
          <ClockArrowDown
            className="bg-gray-500 rounded-2xl p-2 size-12"
            onClick={() => nav("/home")}
          ></ClockArrowDown>
        </div>
        <div className="flex flex-col items-center mt-6 gap-y-4">
          {friends.map((friend, index) => (
            <MoneyTrader
              key={friend.id}
              name={
                friend.nickname === "" && editingIndex !== index
                  ? friend.name
                  : friend.nickname
              }
              balance={friend.balance}
              enableEdit={editingIndex === index}
              setEnableEdit={(value) => {
                setEditingIndex(value ? index : null);
              }}
              onNameChange={(newName) => handleNameChange(index, newName)}
              onBalanceChange={(balanceChange) => {
                updateBalance(index, balanceChange);
              }}
              sendNickname={() => sendNickname(index)}
            ></MoneyTrader>
          ))}
        </div>
      </div>
      <MenuBar></MenuBar>
    </>
  );
}

export default Money;
