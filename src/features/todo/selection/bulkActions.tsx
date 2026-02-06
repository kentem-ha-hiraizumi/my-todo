import { useTodoAtom } from "../todoAtom";
import { useSelectionAtom } from "./selectionAtom";

type BulkActionsProps = {
  currentFilter: "active" | "completed";
};

export const BulkActions = ({ currentFilter }: BulkActionsProps) => {
  const { selectedIds, clearSelection } = useSelectionAtom();
  const { todos, setCompleted, removeTodo } = useTodoAtom();

  const selectedCount = selectedIds.length;

  // 選択されたTodoを取得
  const selectedTodos = todos.filter((todo) => selectedIds.includes(todo.id));

  // 完了済みフィルタでは一括完了ボタンを無効化
  const isBulkCompleteDisabled =
    currentFilter === "completed" || selectedCount === 0;

  // 一括完了
  const handleBulkComplete = () => {
    for (const id of selectedIds) {
      setCompleted(id, true);
    }
    clearSelection();
  };

  // 一括削除
  const handleBulkDelete = () => {
    if (
      window.confirm(
        `選択した${selectedCount}件のToDoを削除してもよろしいですか？`,
      )
    ) {
      for (const id of selectedIds) {
        removeTodo(id);
      }
      clearSelection();
    }
  };

  // タスクをコピー
  const handleCopyAsMarkdown = async () => {
    const markdown = selectedTodos.map((todo) => `- ${todo.title}`).join("\n");

    try {
      await navigator.clipboard.writeText(markdown);
    } catch (_error) {
      alert("コピーに失敗しました");
    }
  };

  return (
    <div className="w-120 max-w-[90%] rounded-xl border border-cyan-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium text-slate-700">
          {selectedCount > 0 ? `${selectedCount}件選択中` : "選択なし"}
        </span>
        {selectedCount > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className="text-slate-500 text-sm hover:text-slate-700"
          >
            選択を解除
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleBulkComplete}
          disabled={isBulkCompleteDisabled}
          className="flex-1 cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-emerald-600 active:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          一括完了
        </button>
        <button
          type="button"
          onClick={handleBulkDelete}
          disabled={selectedCount === 0}
          className="flex-1 cursor-pointer rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 shadow-sm transition-colors duration-200 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        >
          一括削除
        </button>
        <button
          type="button"
          onClick={handleCopyAsMarkdown}
          disabled={selectedCount === 0}
          className="flex-1 cursor-pointer rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-cyan-600 active:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          タスクをコピー
        </button>
      </div>
    </div>
  );
};
