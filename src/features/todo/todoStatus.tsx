import { useTodoAtom } from "./todoAtom";

export const TodoStatus = () => {
  const { todos } = useTodoAtom();

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg w-120 max-w-[90%] border border-cyan-100">
      <div className="flex gap-8 justify-center text-sm">
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-600">{totalCount}</div>
          <div className="text-slate-600 text-xs mt-1">総件数</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{activeCount}</div>
          <div className="text-slate-600 text-xs mt-1">未完了</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-teal-600">
            {completedCount}
          </div>
          <div className="text-slate-600 text-xs mt-1">完了済み</div>
        </div>
      </div>
    </div>
  );
};
