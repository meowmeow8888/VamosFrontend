import { Checkbox } from "../components/Home/Checkbox";
import MenuBar from "../components/menuBar";

function Home() {
  return (
    <>
      <div className="flex flex-col m-4 p-4 gap-3
       bg-gray-500 rounded-2xl">
        <Checkbox type="awake" time="7:00"></Checkbox>
        <Checkbox type="ready" time=""></Checkbox>
        <Checkbox type="alive" time="8:30"></Checkbox>
      </div>
      <MenuBar />
    </>
  );
}

export default Home;
