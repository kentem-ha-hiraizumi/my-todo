import { useFilterAtom } from "./filterAtom";

export const TodoFilter = () => {
  const { filter, setFilter } = useFilterAtom();

  return (
    <div className="flex w-fit flex-wrap justify-center gap-2">
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
  );
};
