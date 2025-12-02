import { useState } from "react";
import { createPortal } from "react-dom";
import { useTodoAtom } from "../todoAtom";
import { TodoDeleteModal } from "./todoDeleteModal";

export const TodoItemNavigation = ({
  id,
  completed,
  onEdit,
  onToggleComplete,
}: {
  id: string;
  completed: boolean;
  onEdit: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { removeTodo } = useTodoAtom();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="bg-cyan-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-cyan-600 transition-colors duration-200 shadow-sm font-medium"
        onClick={() => onEdit(id)}
      >
        編集
      </button>
      <button
        type="button"
        className={`text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 shadow-sm font-medium ${completed ? "bg-slate-400 hover:bg-slate-500" : "bg-teal-500 hover:bg-teal-600"}`}
        onClick={() => {
          onToggleComplete(id, !completed);
        }}
      >
        {completed ? "戻す" : "完了"}
      </button>
      <button
        type="button"
        className={`px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 shadow-sm ${completed ? "bg-slate-200 hover:bg-slate-300 text-slate-600" : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"}`}
        onClick={() => {
          if (completed) {
            removeTodo(id);
          } else {
            setDeleteModalOpen(true);
          }
        }}
      >
        🗑️
      </button>

      {deleteModalOpen &&
        // ポータルを使ってモーダルをbody直下にレンダリング
        createPortal(
          <TodoDeleteModal
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={() => {
              removeTodo(id);
              setDeleteModalOpen(false);
            }}
          />,
          document.body,
        )}
    </div>
  );
};
