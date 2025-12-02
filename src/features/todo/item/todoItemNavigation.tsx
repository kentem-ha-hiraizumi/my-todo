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
        className="cursor-pointer rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-cyan-600"
        onClick={() => onEdit(id)}
      >
        編集
      </button>
      <button
        type="button"
        className={`cursor-pointer rounded-lg px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 ${completed ? "bg-slate-400 hover:bg-slate-500" : "bg-teal-500 hover:bg-teal-600"}`}
        onClick={() => {
          onToggleComplete(id, !completed);
        }}
      >
        {completed ? "戻す" : "完了"}
      </button>
      <button
        type="button"
        className={`cursor-pointer rounded-lg px-3 py-2 shadow-sm transition-all duration-200 ${completed ? "bg-slate-200 text-slate-600 hover:bg-slate-300" : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"}`}
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
