import { TodoFilter } from "../features/todo/filter/todoFilter";
import { useTodoAtom } from "../features/todo/todoAtom";
import { TodoForm } from "../features/todo/todoForm";
import { TodoList } from "../features/todo/todoList";

export const App = () => {
  const { todos } = useTodoAtom();

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <main className="p-4 flex flex-col gap-4 items-center">
      <h1 className="text-3xl font-bold text-sky-800">My ToDo</h1>

      {/* タスク件数表示 */}
      <div className="bg-white p-4 rounded-lg shadow-md w-120 max-w-[90%]">
        <div className="flex gap-6 justify-center text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-sky-700">{totalCount}</div>
            <div className="text-gray-600">総件数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {activeCount}
            </div>
            <div className="text-gray-600">未完了</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedCount}
            </div>
            <div className="text-gray-600">完了済み</div>
          </div>
        </div>
      </div>

      <TodoForm />

      {/* フィルター&ソート */}
      <TodoFilter />

      <TodoList />
    </main>
  );
};
