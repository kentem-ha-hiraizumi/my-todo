type TodoItemProps = {
  id: string;
  title: string;
  endAt?: number;
  completed: boolean;
  overdue: boolean;
  onEdit: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string, completed: boolean) => void;
};

export const TodoItem = ({
  id,
  title,
  endAt,
  completed,
  overdue,
  onEdit,
  onToggleComplete,
  onDelete,
}: TodoItemProps) => {
  return (
    <>
      <div className="flex-1">
        <h2
          className={`text-lg font-semibold ${
            completed
              ? "line-through text-gray-500"
              : overdue
                ? "text-red-700 font-bold"
                : ""
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-sm ${overdue ? "text-red-600 font-semibold" : "text-gray-500"}`}
        >
          {endAt
            ? `期日: ${new Date(endAt).toLocaleDateString()}${overdue ? " (期限超過)" : ""}`
            : "期限なし"}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600"
          onClick={() => onEdit(id)}
        >
          編集
        </button>
        <button
          type="button"
          className={`text-white px-3 py-1 rounded cursor-pointer ${completed ? "bg-gray-400 hover:bg-gray-500" : "bg-teal-600 hover:bg-teal-800"}`}
          onClick={() => {
            onToggleComplete(id, !completed);
          }}
        >
          {completed ? "戻す" : "完了する"}
        </button>
        <button
          type="button"
          className={`border-2  text-white p-1 rounded cursor-pointer ${completed ? "border-slate-400 hover:bg-slate-300" : "border-red-700 hover:bg-red-200"}`}
          onClick={() => {
            onDelete(id, completed);
          }}
        >
          🗑️
        </button>
      </div>
    </>
  );
};
