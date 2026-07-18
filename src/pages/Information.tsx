import MenuBar from "../components/menuBar";

function Information() {
  return (
    <div className="w-fit h-fit m-8">
      <div className="flex flex-col h-full">
        <textarea
          className="flex-1 p-4 rounded-2xl border resize-none"
          placeholder="Write here..."
        />
      </div>
      <MenuBar></MenuBar>
    </div>
  );
}

export default Information;
