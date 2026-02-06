import { useState } from "react";
import { createPortal } from "react-dom";
import { useTodoAtom } from "../todoAtom";
import { TodoDeleteModal } from "./todoDeleteModal";

export const TodoItemNavigation = ({
  id,
  completed,
  hasNote,
  onShowNote,
  onEdit,
  onToggleComplete,
}: {
  id: string;
  completed: boolean;
  hasNote: boolean;
  onShowNote: () => void;
  onEdit: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { removeTodo } = useTodoAtom();

  return (
    <div className="flex gap-2">
      {hasNote && (
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-slate-500 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-slate-600 active:bg-slate-700"
          onClick={onShowNote}
        >
          詳細
        </button>
      )}
      {!completed && (
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-cyan-600 active:bg-cyan-700"
          onClick={() => onEdit(id)}
        >
          編集
        </button>
      )}
      <button
        type="button"
        className={`cursor-pointer rounded-lg px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 ${completed ? "bg-slate-400 hover:bg-slate-500 active:bg-slate-600" : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"}`}
        onClick={() => {
          onToggleComplete(id, !completed);
        }}
      >
        {completed ? "戻す" : "完了"}
      </button>
      <button
        type="button"
        className={`cursor-pointer rounded-lg px-3 py-2 font-medium shadow-sm transition-colors duration-200 ${completed ? "bg-slate-400 text-white hover:bg-slate-500 active:bg-slate-600" : "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"}`}
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
