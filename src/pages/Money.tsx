import { useEffect, useState } from "react";
import MenuBar from "../components/menuBar";
import { MoneyTrader } from "../components/MoneyTrader";
import { BASE_URL } from "../utils/constants";

interface Friend {
  id: number;
  name: string;
  balance: number;
}

interface Transaction {
  senderId: number;
  receiverId: number;
  amount: number;
}

function Money() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [txQueue, setTxQueue] = useState<Transaction[]>([]);
  const username = "Guy Mosseri";
  const [myId, setMyId] = useState(0);

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

  const getMyId = async () => {
    const res = await fetch(
      `${BASE_URL}/api/id?name=${encodeURIComponent(username)}`,
    );
    const data = await res.json();
    setMyId(data.id);
  };

  const commitTransactions = async () => {
    const tx = txQueue[0];
    if (tx) {
      await fetch(`${BASE_URL}/api/transactions`, {
        method: "POST",
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
        i === index ? { ...friend, name: newName } : friend,
      ),
    );
  };

  const updateBalance = (index: number, balanceChange: number) => {
    setFriends((prev) =>
      prev.map((friend, i) => {
        if (i === index) {
          const newTx: Transaction = {
            senderId: myId,
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
    if (!username) return;
    getFriends();
    getMyId();
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
            onBalanceChange={(balanceChange) => {
              console.log("balance change", balanceChange);
              updateBalance(index, balanceChange);
            }}
          ></MoneyTrader>
        ))}
      </div>
      <MenuBar></MenuBar>
    </>
  );
}

export default Money;
