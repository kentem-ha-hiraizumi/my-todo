import { useSelectionAtom } from "../selection/selectionAtom";
import { useFilterAtom } from "./filterAtom";

export const TodoFilter = () => {
  const { filter, setFilter } = useFilterAtom();
  const { clearSelection } = useSelectionAtom();

  const handleFilterChange = (newFilter: "active" | "completed") => {
    setFilter(newFilter);
    clearSelection(); // フィルタ切り替え時に選択をクリア
  };

  return (
    <div className="flex w-fit flex-wrap justify-center gap-2">
      <button
        type="button"
        className={`cursor-pointer rounded-lg border px-4 py-2 font-medium shadow-sm transition-all duration-200 ${filter === "active" ? "border-cyan-500 bg-cyan-500 text-white shadow-md" : "border-cyan-200 bg-white/80 text-slate-700 hover:bg-cyan-50"}`}
        onClick={() => handleFilterChange("active")}
      >
        未完了
      </button>
      <button
        type="button"
        className={`cursor-pointer rounded-lg border px-4 py-2 font-medium shadow-sm transition-all duration-200 ${filter === "completed" ? "border-cyan-500 bg-cyan-500 text-white shadow-md" : "border-cyan-200 bg-white/80 text-slate-700 hover:bg-cyan-50"}`}
        onClick={() => handleFilterChange("completed")}
      >
        完了済み
      </button>
    </div>
  );
};
