import { useEffect, useState } from "react";
import MenuBar from "../components/menuBar";
import { Pencil, Save } from "lucide-react";

function Information() {
  const [enableEdit, setEnableEdit] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const defaultLines = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];
  const [lines, setLines] = useState<string[]>(() => {
    const saved = localStorage.getItem("lines");

    if (!saved || saved === "undefined") {
      return defaultLines;
    }

    try {
      const parsed: string[] = JSON.parse(saved);
      return parsed.length === 0 ? defaultLines : parsed;
    } catch (error) {
      console.error("Failed to parse saved lines from localStorage:", error);
      return defaultLines;
    }
  });

  useEffect(() => {
    localStorage.setItem("lines", JSON.stringify(lines));
  }, [lines]);

  return (
    <div className="">
      <div className="h-[calc(100vh-6rem)]">
        <div
          className="size-10 fixed right-5 top-5 z-50 rounded-2xl bg-white"
          onClick={() => setEnableEdit((p) => !p)}
        >
          <Pencil
            size={24}
            className={`absolute translate-y-2 translate-x-2 transition-all text-black duration-300 ${
              enableEdit ? "opacity-0 scale-80" : "opacity-100 scale-100"
            }`}
          />

          <Save
            size={24}
            className={`absolute translate-y-2 translate-x-2 transition-all text-black duration-300 ${
              enableEdit ? "opacity-100 scale-100" : "opacity-0 scale-80"
            }`}
          />
        </div>
        <div
          className={`flex flex-col h-full overflow-auto m-8 p-2 rounded-2xl transition-all duration-300 ease-in-out ${
            enableEdit ? "outline-2 bg-gray-700" : "bg-gray-500"
          }`}
        >
          {lines.map((line, index) =>
            enableEdit && index === editingIndex ? (
              <input
                className="w-full bg-transparent border-none outline-none p-0 m-0 font-inherit text-inherit"
                key={index}
                autoFocus
                value={line}
                onChange={(e) => {
                  const newLines = [...lines];
                  newLines[index] = e.target.value;
                  setLines(newLines);
                }}
                onBlur={() => setEditingIndex(null)}
              />
            ) : (
              <p key={index} onClick={() => setEditingIndex(index)}>
                {line || "\u00A0"}
              </p>
            ),
          )}
        </div>
      </div>
      <MenuBar></MenuBar>
    </div>
  );
}

export default Information;
