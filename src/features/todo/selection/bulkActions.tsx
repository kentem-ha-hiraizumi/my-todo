import { useTodoAtom } from "../todoAtom";
import { useSelectionAtom } from "./selectionAtom";

export const BulkActions = () => {
  const { selectedIds, clearSelection } = useSelectionAtom();
  const { todos, setCompleted, removeTodo } = useTodoAtom();

  const selectedCount = selectedIds.length;

  // 選択されたTodoを取得
  const selectedTodos = todos.filter((todo) => selectedIds.includes(todo.id));

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

  // Markdownリスト形式でコピー
  const handleCopyAsMarkdown = async () => {
    const markdown = selectedTodos.map((todo) => `- ${todo.title}`).join("\n");
    try {
      await navigator.clipboard.writeText(markdown);
      alert("Markdownリストとしてコピーしました");
    } catch (_error) {
      alert("コピーに失敗しました");
    }
  };

  // 選択がない場合は何も表示しない
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="w-120 max-w-[90%] rounded-xl border border-cyan-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium text-slate-700">
          {selectedCount}件選択中
        </span>
        <button
          type="button"
          onClick={clearSelection}
          className="text-slate-500 text-sm hover:text-slate-700"
        >
          選択を解除
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleBulkComplete}
          className="flex-1 rounded-lg bg-green-500 px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-green-600"
        >
          一括完了
        </button>
        <button
          type="button"
          onClick={handleBulkDelete}
          className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-red-600"
        >
          一括削除
        </button>
        <button
          type="button"
          onClick={handleCopyAsMarkdown}
          className="flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-blue-600"
        >
          Markdown形式でコピー
        </button>
      </div>
    </div>
  );
};
