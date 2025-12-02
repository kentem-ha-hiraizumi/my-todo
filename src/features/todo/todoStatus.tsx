import { useTodoAtom } from "./todoAtom";

export const TodoStatus = () => {
  const { todos } = useTodoAtom();

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <div className="w-120 max-w-[90%] rounded-xl border border-cyan-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
      <div className="flex justify-center gap-8 text-sm">
        <div className="text-center">
          <div className="font-bold text-3xl text-cyan-600">{totalCount}</div>
          <div className="mt-1 text-slate-600 text-xs">総件数</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-3xl text-blue-600">{activeCount}</div>
          <div className="mt-1 text-slate-600 text-xs">未完了</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-3xl text-teal-600">
            {completedCount}
          </div>
          <div className="mt-1 text-slate-600 text-xs">完了済み</div>
        </div>
      </div>
    </div>
  );
};
