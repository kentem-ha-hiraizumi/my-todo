import type { Todo } from "../todoAtom";
import { isDueToday, isOverdue } from "../utils/dateJudge";
import {
  getTodoDateStyle,
  getTodoTitleStyle,
  getTodoVariant,
} from "../utils/todoVariant";
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
  const variant = getTodoVariant(completed, overdue, dueToday);

  return (
    <div className="space-y-2">
      <div className="flex-1 space-y-1">
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={getTodoTitleStyle(variant, true)}
          >
            {title}
          </a>
        ) : (
          <h2 className={getTodoTitleStyle(variant, false)}>{title}</h2>
        )}
        {note && (
          <details>
            <summary className="cursor-pointer text-slate-500 text-sm">
              詳細
            </summary>
            <div className="whitespace-pre-wrap text-slate-600">{note}</div>
          </details>
        )}
        <p className={getTodoDateStyle(variant)}>
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
