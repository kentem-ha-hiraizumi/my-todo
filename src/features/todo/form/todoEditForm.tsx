import { useState } from "react";

type TodoEditFormProps = {
  id: string;
  title: string;
  endAt?: number;
  onUpdate: (id: string, data: { title: string; endAt?: number }) => void;
  onCancel: () => void;
};

export const TodoEditForm = ({
  id,
  title,
  endAt,
  onUpdate,
  onCancel,
}: TodoEditFormProps) => {
  const [editTitle, setEditTitle] = useState(title);
  const [editEndAt, setEditEndAt] = useState(
    endAt ? new Date(endAt).toISOString().split("T")[0] : "",
  );

  const handleSave = () => {
    onUpdate(id, {
      title: editTitle,
      endAt: editEndAt ? new Date(editEndAt).getTime() : undefined,
    });
  };

  return (
    <>
      <div className="flex-1 space-y-3">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full p-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors duration-200"
        />
        <input
          type="date"
          value={editEndAt}
          onChange={(e) => setEditEndAt(e.target.value)}
          className="w-full p-3 border-2 border-cyan-200 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors duration-200"
        />
      </div>
      <div className="flex gap-2 ml-3">
        <button
          type="button"
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-cyan-600 transition-colors duration-200 shadow-sm font-medium"
          onClick={handleSave}
        >
          保存
        </button>
        <button
          type="button"
          className="bg-slate-400 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-500 transition-colors duration-200 shadow-sm font-medium"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </>
  );
};
