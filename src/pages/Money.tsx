import { useEffect, useState } from "react";
import MenuBar from "../components/menuBar";
import { MoneyTrader } from "../components/MoneyTrader";
import { BASE_URL } from "../utils/constants";

interface Friend {
  id: number;
  name: string;
  balance: number;
}

type TxType = "send" | "receive";

interface Transaction {
  type: TxType;
  friendId: number;
  amount: number;
}

function Money() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [txQueue, setTxQueue] = useState<Transaction[]>([]);
  const username = "Guy Mosseri";

  const getFriends = async () => {
    const res = await fetch(
      `${BASE_URL}/api/friends?name=${encodeURIComponent(username)}`,
    );
    const data = await res.json();
    setFriends(
      data.friends.map((friend: Friend) => {
        return { id: friend.id, name: friend.name, balance: friend.balance };
      }),
    );
  };

  const commitTransactions = async () => {
    const queue = txQueue;

    for (const tx of queue) {
      try {
        await fetch(
          `${BASE_URL}/api/transactions?name=${encodeURIComponent(username)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tx }),
          },
        );
      } catch (e) {
        break;
      }
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    setFriends((prev) =>
      prev.map((friend, i) =>
        i === index ? { ...friend, name: newName } : friend,
      ),
    );
  };

  const updateBalance = (index: number, balanceChange: number) => {
    let friendId: number = 0
    setFriends((prev) =>
      prev.map((friend, i) => {
        if (i === index) {
          friendId = friend.id
          return { ...friend, balance: friend.balance + balanceChange };
        } else {
          return friend;
        }
      }),
    );
    const newTx: Transaction = {
      type: balanceChange > 0 ? "receive" : "send",
      friendId: friendId,
      amount: Math.abs(balanceChange),
    };
    setTxQueue((prev) => [...prev, newTx]);
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
            key={index}
            name={friend.name}
            balance={friend.balance}
            onNameChange={(newName) => handleNameChange(index, newName)}
            onBalanceChange={(balanceChange) =>
              updateBalance(index, balanceChange)
            }
          ></MoneyTrader>
        ))}
      </div>
      <MenuBar></MenuBar>
    </>
  );
}

export default Money;
