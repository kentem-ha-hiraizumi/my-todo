import type { Todo } from "../todoAtom";
import { isDueToday, isOverdue } from "../utils/dateJudge";
import { TodoItemNavigation } from "./todoItemNavigation";

type TodoItemProps = {
  todo: Todo;
  onEdit: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
};

export const TodoItem = ({ todo, onEdit, onToggleComplete }: TodoItemProps) => {
  const { id, title, note, endAt, url, completed } = todo;
  const overdue = isOverdue(endAt, completed);
  const dueToday = isDueToday(endAt, completed);

  return (
    <div className="space-y-2">
      <div className="flex-1 space-y-1">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-lg font-semibold hover:underline ${
              completed
                ? "line-through text-slate-400"
                : overdue
                  ? "text-red-600 font-bold"
                  : dueToday
                    ? "text-sky-500 font-bold"
                    : "text-sky-500"
            }`}
          >
            {title}
          </a>
        ) : (
          <h2
            className={`text-lg font-semibold ${
              completed
                ? "line-through text-slate-400"
                : overdue
                  ? "text-red-600 font-bold"
                  : dueToday
                    ? "text-blue-600 font-bold"
                    : "text-slate-700"
            }`}
          >
            {title}
          </h2>
        )}
        {note && (
          <details>
            <summary className="cursor-pointer text-sm text-slate-500">
              詳細
            </summary>
            <div className="text-slate-600 whitespace-pre-wrap">{note}</div>
          </details>
        )}
        <p
          className={`text-sm ${
            overdue
              ? "text-red-500 font-semibold"
              : dueToday
                ? "text-blue-500 font-semibold"
                : "text-slate-500"
          }`}
        >
          {endAt
            ? `期日: ${new Date(endAt).toLocaleDateString()}${overdue ? " (期限超過)" : dueToday ? " (本日期限)" : ""}`
            : "期限なし"}
        </p>
      </div>
      <TodoItemNavigation
        id={id}
        completed={completed}
        onEdit={onEdit}
        onToggleComplete={onToggleComplete}
      />
    </div>
  );
};
