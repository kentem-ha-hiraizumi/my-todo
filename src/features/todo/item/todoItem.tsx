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
            className={`font-semibold text-lg hover:underline ${
              completed
                ? "text-slate-400 line-through"
                : overdue
                  ? "font-bold text-red-600"
                  : dueToday
                    ? "font-bold text-sky-500"
                    : "text-sky-500"
            }`}
          >
            {title}
          </a>
        ) : (
          <h2
            className={`font-semibold text-lg ${
              completed
                ? "text-slate-400 line-through"
                : overdue
                  ? "font-bold text-red-600"
                  : dueToday
                    ? "font-bold text-blue-600"
                    : "text-slate-700"
            }`}
          >
            {title}
          </h2>
        )}
        {note && (
          <details>
            <summary className="cursor-pointer text-slate-500 text-sm">
              詳細
            </summary>
            <div className="whitespace-pre-wrap text-slate-600">{note}</div>
          </details>
        )}
        <p
          className={`text-sm ${
            overdue
              ? "font-semibold text-red-500"
              : dueToday
                ? "font-semibold text-blue-500"
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
