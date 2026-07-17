import { useState } from "react";
import { Info, LogOut } from "lucide-react";
import { Checkbox } from "../components/Home/Checkbox";
import MenuBar from "../components/menuBar";
import { useAuth } from "../providers/AuthProvider";

interface Friend {
  id: number | null;
  name: string;
  balance: number;
  nickname: string;
}

function Home() {
  const { logout } = useAuth();

  return (
    <>
      <LogOut className="m-3 ml-auto p-2 size-9 rounded-2xl bg-gray-500" onClick={logout}></LogOut>
      <div className="m-4 bg-gray-500 rounded-2xl">
        <Info className="size-6 absolute -translate-y-3 translate-x-2 bg-gray-500 rounded-2xl"></Info>
        <div className="flex flex-col p-4 gap-y-2">
          <Checkbox type="awake" time="7:00"></Checkbox>
          <Checkbox type="ready" time=""></Checkbox>
          <Checkbox type="alive" time="8:30"></Checkbox>
        </div>
      </div>
      <div
        className="flex flex-col m-4 ml-auto p-4 w-fit gap-3
       bg-gray-500 rounded-2xl"
      ></div>
      <MenuBar />
    </>
  );
}

export default Home;
