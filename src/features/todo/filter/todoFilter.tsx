import type { SortType } from "./filterAtom";
import { useFilterAtom } from "./filterAtom";

export const TodoFilter = () => {
  const { filter, setFilter, sort, setSort } = useFilterAtom();

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1 rounded ${filter === "all" ? "bg-sky-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          すべて
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded ${filter === "active" ? "bg-sky-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("active")}
        >
          未完了
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded ${filter === "completed" ? "bg-sky-600 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("completed")}
        >
          完了済み
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="px-3 py-1 rounded border-2 border-gray-300"
        >
          <option value="none">並び替えなし</option>
          <option value="date-asc">期日が近い順</option>
          <option value="date-desc">期日が遠い順</option>
        </select>
      </div>
    </div>
  );
};
