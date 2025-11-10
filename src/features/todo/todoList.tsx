import { useState } from "react";
import { useFilteredTodos } from "./filter/useFilteredTodos";
import { TodoEditForm } from "./form/todoEditForm";
import { useTodoAtom } from "./todoAtom";
import { TodoItem } from "./todoItem";

export const TodoList = () => {
  const { todos, setCompleted, removeTodo, updateTodo } = useTodoAtom();
  const sortedTodos = useFilteredTodos(todos);
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
                <TodoItem
                  id={todo.id}
                  title={todo.title}
                  endAt={todo.endAt}
                  completed={todo.completed}
                  overdue={overdue}
                  onEdit={setEditingId}
                  onToggleComplete={setCompleted}
                  onDelete={handleDelete}
                />
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
