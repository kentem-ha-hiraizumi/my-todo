import { useState } from "react";
import type { Todo } from "../todoAtom";
import { isDueToday, isOverdue } from "../utils/dateJudge";

type TodoEditFormProps = {
  todo: Todo;
  onUpdate: (id: string, data: Partial<Omit<Todo, "id" | "completed">>) => void;
  onCancel: () => void;
};

export const TodoEditForm = ({
  todo,
  onUpdate,
  onCancel,
}: TodoEditFormProps) => {
  const { id, title, endAt, url, completed } = todo;
  const overdue = isOverdue(endAt, completed);
  const dueToday = isDueToday(endAt, completed);

  const [editTitle, setEditTitle] = useState(title);
  const [editNote, setEditNote] = useState(todo.note ?? "");
  const [editEndAt, setEditEndAt] = useState(
    endAt ? new Date(endAt).toISOString().split("T")[0] : "",
  );
  const [editUrl, setEditUrl] = useState(url ?? "");

  const borderColor = overdue
    ? "border-stone-400 focus:border-red-300"
    : dueToday
      ? "border-slate-400 focus:border-blue-300"
      : "border-zinc-400 focus:border-cyan-300";

  const handleSave = () => {
    onUpdate(id, {
      title: editTitle,
      note: editNote,
      endAt: editEndAt ? new Date(editEndAt).getTime() : undefined,
      url: editUrl || undefined,
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex-1 space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className={`w-full rounded-lg border-2 p-3 transition-colors duration-200 focus:outline-none ${
            borderColor
          }`}
        />
        <textarea
          name="note"
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
          rows={4}
          className={`w-full resize-none rounded-lg border-2 p-3 transition-colors duration-200 focus:outline-none ${borderColor}`}
          placeholder="ToDoの詳細"
          maxLength={1000}
          required
        />
        <input
          type="date"
          value={editEndAt}
          onChange={(e) => setEditEndAt(e.target.value)}
          className={`w-full rounded-lg border-2 p-3 transition-colors duration-200 focus:outline-none ${borderColor}`}
        />
        <input
          type="url"
          value={editUrl}
          onChange={(e) => setEditUrl(e.target.value)}
          placeholder="https://example.com"
          className={`w-full rounded-lg border-2 p-3 transition-colors duration-200 focus:outline-none ${borderColor}`}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-cyan-600"
          onClick={handleSave}
        >
          保存
        </button>
        <button
          type="button"
          className="cursor-pointer rounded-lg bg-slate-400 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-slate-500"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};
