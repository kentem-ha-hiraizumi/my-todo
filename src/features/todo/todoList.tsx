import { useState } from "react";
import { useFilterAtom } from "./filterAtom";
import { useTodoAtom } from "./todoAtom";
import { TodoEditForm } from "./todoEditForm";

export const TodoList = () => {
  const { todos, setCompleted, removeTodo, updateTodo } = useTodoAtom();
  const { filter, sort } = useFilterAtom();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleUpdate = (
    id: string,
    data: { title: string; endAt?: number },
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

  // フィルタリング
  let filteredTodos = todos;
  if (filter === "active") {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    filteredTodos = todos.filter((todo) => todo.completed);
  }

  // ソート
  const sortedTodos = [...filteredTodos];
  if (sort === "date-asc") {
    sortedTodos.sort((a, b) => {
      if (!a.endAt) return 1;
      if (!b.endAt) return -1;
      return a.endAt - b.endAt;
    });
  } else if (sort === "date-desc") {
    sortedTodos.sort((a, b) => {
      if (!a.endAt) return 1;
      if (!b.endAt) return -1;
      return b.endAt - a.endAt;
    });
  }

  if (sortedTodos.length === 0) {
    return (
      <div className="p-4 bg-slate-100 w-120 max-w-[90%] rounded text-center">
        empty.
      </div>
    );
  }

  return (
    <>
      <div className="p-4 bg-slate-100 w-120 max-w-[90%] rounded space-y-2">
        {sortedTodos.map((todo) => {
          const overdue = isOverdue(todo.endAt, todo.completed);
          return (
            <div
              key={todo.id}
              className={`flex items-center px-4 py-2 rounded shadow ${
                todo.completed
                  ? "bg-slate-100"
                  : overdue
                    ? "bg-red-50 border-2 border-red-300"
                    : "bg-white"
              }`}
            >
              {editingId === todo.id ? (
                <TodoEditForm
                  id={todo.id}
                  title={todo.title}
                  endAt={todo.endAt}
                  onUpdate={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex-1">
                    <h2
                      className={`text-lg font-semibold ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : overdue
                            ? "text-red-700 font-bold"
                            : ""
                      }`}
                    >
                      {todo.title}
                    </h2>
                    <p
                      className={`text-sm ${overdue ? "text-red-600 font-semibold" : "text-gray-500"}`}
                    >
                      {todo.endAt
                        ? `期日: ${new Date(todo.endAt).toLocaleDateString()}${overdue ? " (期限超過)" : ""}`
                        : "期限なし"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600"
                      onClick={() => setEditingId(todo.id)}
                    >
                      編集
                    </button>
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
                        handleDelete(todo.id, todo.completed);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 削除確認モーダル */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-600/70 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-bold mb-4 text-gray-800">削除確認</h3>
            <p className="mb-6 text-gray-600">
              このタスクは未完了です。本当に削除しますか?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={cancelDelete}
              >
                キャンセル
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
