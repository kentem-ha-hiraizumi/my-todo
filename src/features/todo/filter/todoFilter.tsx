import type { SortType } from "./filterAtom";
import { useFilterAtom } from "./filterAtom";

export const TodoFilter = () => {
  const { filter, setFilter, sort, setSort } = useFilterAtom();

  return (
    <div className="flex gap-4 flex-wrap justify-center w-fit">
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm ${filter === "all" ? "bg-cyan-500 text-white shadow-md" : "bg-white/80 text-slate-700 hover:bg-cyan-50 border border-cyan-200"}`}
          onClick={() => setFilter("all")}
        >
          すべて
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm ${filter === "active" ? "bg-cyan-500 text-white shadow-md" : "bg-white/80 text-slate-700 hover:bg-cyan-50 border border-cyan-200"}`}
          onClick={() => setFilter("active")}
        >
          未完了
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm ${filter === "completed" ? "bg-cyan-500 text-white shadow-md" : "bg-white/80 text-slate-700 hover:bg-cyan-50 border border-cyan-200"}`}
          onClick={() => setFilter("completed")}
        >
          完了済み
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="px-4 py-2 rounded-lg border-2 border-cyan-200 bg-white/80 text-slate-700 font-medium shadow-sm focus:border-cyan-400 focus:outline-none transition-colors duration-200"
        >
          <option value="date-asc">期日が近い順</option>
          <option value="date-desc">期日が遠い順</option>
        </select>
      </div>
    </div>
  );
};
