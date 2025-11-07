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
      <div className="flex-1 space-y-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full p-2 border-2 border-slate-300 rounded"
        />
        <input
          type="date"
          value={editEndAt}
          onChange={(e) => setEditEndAt(e.target.value)}
          className="w-full p-2 border-2 border-slate-300 rounded"
        />
      </div>
      <div className="flex gap-2 ml-2">
        <button
          type="button"
          className="bg-teal-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-teal-700"
          onClick={handleSave}
        >
          保存
        </button>
        <button
          type="button"
          className="bg-gray-400 text-white px-3 py-1 rounded cursor-pointer hover:bg-gray-500"
          onClick={onCancel}
        >
          キャンセル
        </button>
      </div>
    </>
  );
};
