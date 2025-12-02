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
      <div className="w-120 max-w-[90%] rounded-xl border border-cyan-100 bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm">
        <p className="text-slate-500">タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="w-120 max-w-[90%] space-y-6 rounded-xl border border-cyan-100 bg-white/60 p-4 shadow-lg backdrop-blur-sm">
      {groupedTodos.map(({ year, months }) => (
        <div key={year} className="space-y-4">
          {/* 年セクションヘッダー */}
          <h2 className="font-bold text-2xl text-slate-800">
            {year === "no-date" ? "期限なし" : `${year}年`}
          </h2>

          {/* 月グループ */}
          {months.map(({ month, todos: todoList }) => (
            <div key={month} className="space-y-3">
              {/* 月グループヘッダー（期限なしの場合は表示しない） */}
              {year !== "no-date" && (
                <h3 className="font-semibold text-lg text-slate-700">
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
                    className={`flex items-center rounded-lg px-5 py-4 shadow-sm transition-all duration-200 ${
                      todo.completed
                        ? "bg-slate-50/80"
                        : overdue
                          ? "border-2 border-red-300 bg-red-50"
                          : dueToday
                            ? "border-2 border-blue-300 bg-blue-50"
                            : "border border-cyan-100/50 bg-white/90"
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
