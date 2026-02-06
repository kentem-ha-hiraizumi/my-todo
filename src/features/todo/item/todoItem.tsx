import { useRef } from "react";
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
  const noteDialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="space-y-1">
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
        <p className={getTodoDateStyle(variant)}>
          {endAt
            ? `期日: ${new Date(endAt).toLocaleDateString()}${overdue ? " (期限超過)" : dueToday ? " (本日期限)" : ""}`
            : "期限なし"}
        </p>
      </div>
      <TodoItemNavigation
        id={id}
        completed={completed}
        hasNote={!!note}
        onShowNote={() => noteDialogRef.current?.showModal()}
        onEdit={onEdit}
        onToggleComplete={onToggleComplete}
      />
      {note && (
        <dialog
          ref={noteDialogRef}
          closedby="any"
          className="fixed inset-0 m-auto w-120 max-w-[90%] cursor-default rounded-xl border-none bg-white/95 p-0 shadow-2xl backdrop-blur-sm backdrop:bg-black/40"
        >
          <div className="flex items-center justify-between border-cyan-100 border-b p-5">
            <h2 className="font-bold text-cyan-700 text-lg">{title}</h2>
          </div>
          <div className="whitespace-pre-wrap p-6 text-slate-600">{note}</div>
        </dialog>
      )}
    </div>
  );
};
