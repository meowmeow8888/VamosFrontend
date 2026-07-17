import { useEffect, useState } from "react";
import MenuBar from "../components/menuBar";
import { MoneyTrader } from "../components/Money/MoneyTrader";
import { BASE_URL } from "../utils/constants";
import { useAuth } from "../providers/AuthProvider";

export interface Friend {
  id: number;
  name: string;
  balance: number;
  nickname: string;
}

interface Transaction {
  senderId: number | null;
  receiverId: number;
  amount: number;
}

function Money() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [txQueue, setTxQueue] = useState<Transaction[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { userId } = useAuth();

  const getFriends = async () => {
    const res = await fetch(`${BASE_URL}/api/friends`, {
      credentials: "include",
    });
    const data = await res.json();
    setFriends(
      data.friends.map((friend: Friend) => {
        return {
          id: friend.id,
          name: friend.name,
          balance: friend.balance,
          nickname: friend.nickname,
        };
      }),
    );
  };

  const commitTransactions = async () => {
    const tx = txQueue[0];
    if (tx) {
      await fetch(`${BASE_URL}/api/transactions`, {
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
    setFriends((prev) =>
      prev.map((friend, i) => {
        if (i === index) {
          const newTx: Transaction = {
            senderId: userId,
            receiverId: friend.id,
            amount: balanceChange,
          };
          setTxQueue((prev) => [...prev, newTx]);
          return { ...friend, balance: friend.balance + balanceChange };
        } else {
          return friend;
        }
      }),
    );
  };

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    if (txQueue.length === 0) return;
    commitTransactions();
  }, [txQueue]);

  return (
    <>
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
      <MenuBar></MenuBar>
    </>
  );
}

export default Money;
