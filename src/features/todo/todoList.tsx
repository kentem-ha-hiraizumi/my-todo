import { useState } from "react";
import { useGroupedTodos } from "./filter/useGroupedTodos";
import { TodoEditForm } from "./form/todoEditForm";
import { TodoItem } from "./item/todoItem";
import { type Todo, useTodoAtom } from "./todoAtom";
import { isDueToday, isOverdue } from "./utils/dateJudge";

export const TodoList = () => {
  const { todos, setCompleted, updateTodo } = useTodoAtom();
  const groupedTodos = useGroupedTodos(todos);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleUpdate = (
    id: string,
    data: Partial<Omit<Todo, "id" | "completed">>,
  ) => {
    updateTodo(id, data);
    setEditingId(null);
  };

  // グループが空かどうかを確認
  const hasAnyTodos = groupedTodos.length > 0;

  if (!hasAnyTodos) {
    return (
      <div className="p-6 bg-white/60 backdrop-blur-sm w-120 max-w-[90%] rounded-xl shadow-lg text-center border border-cyan-100">
        <p className="text-slate-500">タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white/60 backdrop-blur-sm w-120 max-w-[90%] rounded-xl shadow-lg space-y-6 border border-cyan-100">
      {groupedTodos.map(({ year, months }) => (
        <div key={year} className="space-y-4">
          {/* 年セクションヘッダー */}
          <h2 className="text-2xl font-bold text-slate-800">
            {year === "no-date" ? "期限なし" : `${year}年`}
          </h2>

          {/* 月グループ */}
          {months.map(({ month, todos: todoList }) => (
            <div key={month} className="space-y-3">
              {/* 月グループヘッダー（期限なしの場合は表示しない） */}
              {year !== "no-date" && (
                <h3 className="text-lg font-semibold text-slate-700">
                  {month}月
                </h3>
              )}

              {/* Todoリスト */}
              {todoList.map((todo) => {
                const overdue = isOverdue(todo.endAt, todo.completed);
                const dueToday = isDueToday(todo.endAt, todo.completed);

                return (
                  <div
                    key={todo.id}
                    className={`flex items-center px-5 py-4 rounded-lg shadow-sm transition-all duration-200 ${
                      todo.completed
                        ? "bg-slate-50/80"
                        : overdue
                          ? "bg-red-50 border-2 border-red-300"
                          : dueToday
                            ? "bg-blue-50 border-2 border-blue-300"
                            : "bg-white/90 border border-cyan-100/50"
                    }`}
                  >
                    {editingId === todo.id ? (
                      <TodoEditForm
                        todo={todo}
                        onUpdate={handleUpdate}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <TodoItem
                        todo={todo}
                        onEdit={setEditingId}
                        onToggleComplete={setCompleted}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
