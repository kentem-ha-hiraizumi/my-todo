import { useState } from "react";
import { useGroupedTodos } from "./filter/useGroupedTodos";
import { EditDialog } from "./form/todoEditForm";
import { TodoItem } from "./item/todoItem";
import { useSelectionAtom } from "./selection/selectionAtom";
import { type Todo, useTodoAtom } from "./todoAtom";
import { isDueToday, isOverdue } from "./utils/dateJudge";
import { getTodoContainerStyle, getTodoVariant } from "./utils/todoVariant";

export const TodoList = () => {
  const { todos, setCompleted, updateTodo } = useTodoAtom();
  const {
    isSelected,
    toggleSelection,
    toggleMultipleSelection,
    areAllSelected,
    areSomeSelected,
  } = useSelectionAtom();
  const groupedTodos = useGroupedTodos(todos);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEdit = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) setEditingTodo(todo);
  };

  const handleUpdate = (
    id: string,
    data: Partial<Omit<Todo, "id" | "completed">>,
  ) => {
    updateTodo(id, data);
    setEditingTodo(null);
  };

  // グループが空かどうかを確認
  const hasAnyTodos = groupedTodos.length > 0;

  if (!hasAnyTodos) {
    return (
      <div className="w-full max-w-7xl rounded-xl border border-cyan-100 bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm">
        <p className="text-slate-500">タスクがありません</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl space-y-6 rounded-xl border border-cyan-100 bg-white/60 p-4 shadow-lg backdrop-blur-sm">
      <EditDialog
        todo={editingTodo}
        onUpdate={handleUpdate}
        onClose={() => setEditingTodo(null)}
      />
      {groupedTodos.map(({ year, months }) => {
        // 年全体のTodoIDリスト
        const yearTodoIds = months.flatMap(({ todos: todoList }) =>
          todoList.map((todo) => todo.id),
        );
        const yearAllSelected = areAllSelected(yearTodoIds);
        const yearSomeSelected = areSomeSelected(yearTodoIds);

        return (
          <div key={year} className="space-y-4">
            {/* 年セクションヘッダー */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={yearAllSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = yearSomeSelected;
                  }
                }}
                onChange={() => toggleMultipleSelection(yearTodoIds)}
                className="h-5 w-5 cursor-pointer rounded border-slate-300 text-cyan-600 accent-sky-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0"
                aria-label={`${year === "no-date" ? "期限なし" : `${year}年`}のタスクを全て選択`}
              />
              <h2 className="font-bold text-2xl text-slate-800">
                {year === "no-date" ? "期限なし" : `${year}年`}
              </h2>
            </div>

            {/* 月グループ */}
            {months.map(({ month, todos: todoList }) => {
              const monthTodoIds = todoList.map((todo) => todo.id);
              const monthAllSelected = areAllSelected(monthTodoIds);
              const monthSomeSelected = areSomeSelected(monthTodoIds);

              return (
                <div key={month} className="space-y-3">
                  {/* 月グループヘッダー（期限なしの場合は表示しない） */}
                  {year !== "no-date" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={monthAllSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = monthSomeSelected;
                          }
                        }}
                        onChange={() => toggleMultipleSelection(monthTodoIds)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-cyan-600 accent-sky-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0"
                        aria-label={`${month}月のタスクを全て選択`}
                      />
                      <h3 className="font-semibold text-lg text-slate-700">
                        {month}月
                      </h3>
                    </div>
                  )}

                  {/* Todoリスト */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {todoList.map((todo) => {
                      const overdue = isOverdue(todo.endAt, todo.completed);
                      const dueToday = isDueToday(todo.endAt, todo.completed);
                      const variant = getTodoVariant(
                        todo.completed,
                        overdue,
                        dueToday,
                      );
                      const selected = isSelected(todo.id);

                      const handleClick = (e: React.MouseEvent) => {
                        // リンク、ボタンのクリックでは選択を切り替えない
                        const target = e.target as HTMLElement;
                        if (
                          target.tagName === "A" ||
                          target.tagName === "BUTTON" ||
                          target.tagName === "INPUT" ||
                          target.closest("button") ||
                          target.closest("a")
                        ) {
                          return;
                        }
                        toggleSelection(todo.id);
                      };

                      const handleKeyDown = (e: React.KeyboardEvent) => {
                        // ボタンやリンクにフォーカス中はそちらを優先
                        const target = e.target as HTMLElement;
                        if (
                          target.tagName === "BUTTON" ||
                          target.tagName === "A" ||
                          target.closest("button") ||
                          target.closest("a")
                        ) {
                          return;
                        }
                        // TODO自体やチェックボックスにフォーカス中のみ選択を切り替え
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleSelection(todo.id);
                        }
                      };

                      const handleCheckboxChange = () => {
                        toggleSelection(todo.id);
                      };

                      return (
                        <div
                          key={todo.id}
                          role="button"
                          tabIndex={0}
                          onClick={handleClick}
                          onKeyDown={handleKeyDown}
                          className={`flex cursor-pointer items-center gap-3 rounded-lg px-5 py-4 shadow-sm transition-all duration-200 ${getTodoContainerStyle(variant)} ${selected ? "ring-4 ring-cyan-400" : ""}`}
                        >
                          {/* 選択用チェックボックス */}
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={handleCheckboxChange}
                            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-cyan-600 accent-sky-600 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0"
                            aria-label={`${todo.title}を選択`}
                          />
                          <TodoItem
                            todo={todo}
                            onEdit={handleEdit}
                            onToggleComplete={setCompleted}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
