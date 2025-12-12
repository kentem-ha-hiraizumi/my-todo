import { useMemo, useState } from "react";
import { useTodoAtom } from "../todoAtom";
import {
  copyToClipboard,
  filterUrgentTodos,
  formatTodosAsText,
} from "../utils/clipboardUtils";

export const TodoCopyButton = () => {
  const { todos } = useTodoAtom();
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // 本日のタスクをメモ化して重複計算を避ける
  const urgentTodos = useMemo(() => filterUrgentTodos(todos), [todos]);

  const handleCopy = async () => {
    const text = formatTodosAsText(urgentTodos);
    const success = await copyToClipboard(text);

    if (success) {
      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } else {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const getButtonStyle = () => {
    switch (copyStatus) {
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "error":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-cyan-600 hover:bg-cyan-700 text-white";
    }
  };

  const getButtonText = () => {
    switch (copyStatus) {
      case "success":
        return "コピーしました！";
      case "error":
        return "コピー失敗";
      default:
        return "期限切れ・本日期限のタスクをコピー";
    }
  };

  return (
    <div className="w-120 max-w-[90%] rounded-xl border border-cyan-100 bg-white/60 p-6 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={handleCopy}
        disabled={copyStatus !== "idle" || urgentTodos.length === 0}
        className={`w-full rounded-lg px-4 py-3 font-semibold text-sm shadow-md transition-all duration-200 ${getButtonStyle()} disabled:cursor-not-allowed disabled:opacity-90`}
      >
        {getButtonText()}
      </button>
      {urgentTodos.length > 0 && copyStatus === "idle" && (
        <p className="mt-2 text-center text-slate-600 text-sm">
          本日のタスクは{urgentTodos.length}件です
        </p>
      )}
    </div>
  );
};
