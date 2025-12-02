import type { SortType } from "./filterAtom";
import { useFilterAtom } from "./filterAtom";

export const TodoFilter = () => {
  const { filter, setFilter, sort, setSort } = useFilterAtom();

  return (
    <div className="flex w-fit flex-wrap justify-center gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-lg px-4 py-2 font-medium shadow-sm transition-all duration-200 ${filter === "all" ? "bg-cyan-500 text-white shadow-md" : "border border-cyan-200 bg-white/80 text-slate-700 hover:bg-cyan-50"}`}
          onClick={() => setFilter("all")}
        >
          すべて
        </button>
        <button
          type="button"
          className={`rounded-lg px-4 py-2 font-medium shadow-sm transition-all duration-200 ${filter === "active" ? "bg-cyan-500 text-white shadow-md" : "border border-cyan-200 bg-white/80 text-slate-700 hover:bg-cyan-50"}`}
          onClick={() => setFilter("active")}
        >
          未完了
        </button>
        <button
          type="button"
          className={`rounded-lg px-4 py-2 font-medium shadow-sm transition-all duration-200 ${filter === "completed" ? "bg-cyan-500 text-white shadow-md" : "border border-cyan-200 bg-white/80 text-slate-700 hover:bg-cyan-50"}`}
          onClick={() => setFilter("completed")}
        >
          完了済み
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="rounded-lg border-2 border-cyan-200 bg-white/80 px-4 py-2 font-medium text-slate-700 shadow-sm transition-colors duration-200 focus:border-cyan-400 focus:outline-none"
        >
          <option value="date-asc">期日が近い順</option>
          <option value="date-desc">期日が遠い順</option>
        </select>
      </div>
    </div>
  );
};
