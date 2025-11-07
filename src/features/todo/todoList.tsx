import { useTodoAtom } from "./todoAtom";

export const TodoList = () => {
  const { todos, setCompleted, removeTodo } = useTodoAtom();

  if (todos.length === 0) {
    return (
      <div className="p-4 bg-slate-100 w-120 max-w-[90%] rounded text-center">
        empty.
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-100 w-120 max-w-[90%] rounded space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`flex items-center px-4 py-2 rounded shadow ${todo.completed ? "bg-slate-100" : "bg-white"}`}
        >
          <div className="flex-1">
            <h2
              className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-500" : ""}`}
            >
              {todo.title}
            </h2>
            <p className="text-sm text-gray-500">
              {todo.endAt
                ? `期日: ${todo.endAt.toLocaleDateString()}`
                : "期限なし"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className={`text-white px-3 py-1 rounded cursor-pointer ${todo.completed ? "bg-gray-400 hover:bg-gray-500" : "bg-teal-600 hover:bg-teal-800"}`}
              onClick={() => {
                setCompleted(todo.id, !todo.completed);
              }}
            >
              {todo.completed ? "戻す" : "完了する"}
            </button>
            <button
              type="button"
              className={`border-2  text-white p-1 rounded cursor-pointer ${todo.completed ? "border-slate-400 hover:bg-slate-300" : "border-red-700 hover:bg-red-200"}`}
              onClick={() => {
                removeTodo(todo.id);
              }}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
