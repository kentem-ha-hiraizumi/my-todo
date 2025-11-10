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
    <div className="space-y-2">
      <div className="flex-1">
        <h2
          className={`text-lg font-semibold ${
            completed
              ? "line-through text-slate-400"
              : overdue
                ? "text-red-600 font-bold"
                : "text-slate-700"
          }`}
        >
          {title}
        </h2>
        <p
          className={`text-sm ${overdue ? "text-red-500 font-semibold" : "text-slate-500"}`}
        >
          {endAt
            ? `期日: ${new Date(endAt).toLocaleDateString()}${overdue ? " (期限超過)" : ""}`
            : "期限なし"}
        </p>
      </div>
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
            onDelete(id, completed);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
