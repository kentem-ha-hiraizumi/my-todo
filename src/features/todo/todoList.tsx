import { useState } from "react";
import { useGroupedTodos } from "./filter/useGroupedTodos";
import { TodoEditForm } from "./form/todoEditForm";
import { useTodoAtom } from "./todoAtom";
import { TodoItem } from "./todoItem";

export const TodoList = () => {
  const { todos, setCompleted, removeTodo, updateTodo } = useTodoAtom();
  const groupedTodos = useGroupedTodos(todos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleUpdate = (
    id: string,
    data: { title: string; endAt?: number; url?: string },
  ) => {
    updateTodo(id, data);
    setEditingId(null);
  };

  const handleDelete = (id: string, completed: boolean) => {
    if (!completed) {
      setDeleteConfirmId(id);
    } else {
      removeTodo(id);
    }
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      removeTodo(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // 期限超過の判定
  const isOverdue = (endAt?: number, completed?: boolean) => {
    if (!endAt || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endAt < today.getTime();
  };

  // 本日期限の判定
  const isDueToday = (endAt?: number, completed?: boolean) => {
    if (!endAt || completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return endAt >= today.getTime() && endAt < tomorrow.getTime();
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
    <>
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
                          id={todo.id}
                          title={todo.title}
                          endAt={todo.endAt}
                          url={todo.url}
                          onUpdate={handleUpdate}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <TodoItem
                          id={todo.id}
                          title={todo.title}
                          endAt={todo.endAt}
                          url={todo.url}
                          completed={todo.completed}
                          overdue={overdue}
                          dueToday={dueToday}
                          onEdit={setEditingId}
                          onToggleComplete={setCompleted}
                          onDelete={handleDelete}
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

      {/* 削除確認モーダル */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md border border-cyan-100">
            <h3 className="text-xl font-bold mb-4 text-slate-800">削除確認</h3>
            <p className="mb-6 text-slate-600">
              このタスクは未完了です。本当に削除しますか?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors duration-200 font-medium shadow-sm"
                onClick={cancelDelete}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm"
                onClick={confirmDelete}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
