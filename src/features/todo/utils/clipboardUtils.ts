import type { Todo } from "../todoAtom";
import { isDueToday, isOverdue } from "./dateJudge";

/**
 * 期限切れまたは今日期限の未完了タスクをフィルタリングする
 * @param todos - タスクの配列
 * @returns 期限切れまたは今日期限の未完了タスクの配列
 */
export const filterUrgentTodos = (todos: Todo[]): Todo[] => {
  return todos.filter((todo) => {
    if (todo.completed) return false;
    return (
      isOverdue(todo.endAt, todo.completed) ||
      isDueToday(todo.endAt, todo.completed)
    );
  });
};

/**
 * タスクをプレーンテキスト形式に変換する
 * @param todos - タスクの配列
 * @returns プレーンテキスト形式の文字列
 */
export const formatTodosAsText = (todos: Todo[]): string => {
  if (todos.length === 0) {
    return "該当するタスクはありません";
  }

  return todos
    .map((todo) => {
      const overdueLabel = isOverdue(todo.endAt, todo.completed)
        ? "【期限切れ】"
        : "";
      const dueTodayLabel = isDueToday(todo.endAt, todo.completed)
        ? "【本日期限】"
        : "";
      const dateStr = todo.endAt
        ? new Date(todo.endAt).toLocaleDateString("ja-JP")
        : "期限なし";
      const noteStr = todo.note ? `\n  メモ: ${todo.note}` : "";
      const urlStr = todo.url ? `\n  URL: ${todo.url}` : "";

      return `${overdueLabel}${dueTodayLabel}${todo.title} (期限: ${dateStr})${noteStr}${urlStr}`;
    })
    .join("\n\n");
};

/**
 * クリップボードにテキストをコピーする
 * @param text - コピーするテキスト
 * @returns コピーが成功したかどうか
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("クリップボードへのコピーに失敗しました:", error);
    return false;
  }
};

// インソーステスト
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("filterUrgentTodos", () => {
    it("期限切れの未完了タスクを返す", () => {
      const now = Date.now();
      const yesterday = now - 24 * 60 * 60 * 1000;
      const todos: Todo[] = [
        {
          id: "1",
          title: "期限切れタスク",
          completed: false,
          endAt: yesterday,
        },
        { id: "2", title: "完了タスク", completed: true, endAt: yesterday },
        {
          id: "3",
          title: "通常タスク",
          completed: false,
          endAt: now + 24 * 60 * 60 * 1000,
        },
      ];

      const result = filterUrgentTodos(todos);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("1");
    });

    it("今日期限の未完了タスクを返す", () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const todos: Todo[] = [
        {
          id: "1",
          title: "今日期限タスク",
          completed: false,
          endAt: today.getTime(),
        },
        {
          id: "2",
          title: "完了タスク",
          completed: true,
          endAt: today.getTime(),
        },
        {
          id: "3",
          title: "通常タスク",
          completed: false,
          endAt: today.getTime() + 2 * 24 * 60 * 60 * 1000,
        },
      ];

      const result = filterUrgentTodos(todos);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe("1");
    });

    it("完了済みタスクは除外する", () => {
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
      const todos: Todo[] = [
        { id: "1", title: "完了タスク", completed: true, endAt: yesterday },
      ];

      const result = filterUrgentTodos(todos);
      expect(result.length).toBe(0);
    });

    it("該当タスクがない場合は空配列を返す", () => {
      const future = Date.now() + 2 * 24 * 60 * 60 * 1000;
      const todos: Todo[] = [
        { id: "1", title: "未来タスク", completed: false, endAt: future },
      ];

      const result = filterUrgentTodos(todos);
      expect(result.length).toBe(0);
    });
  });

  describe("formatTodosAsText", () => {
    it("タスクがない場合は該当メッセージを返す", () => {
      const result = formatTodosAsText([]);
      expect(result).toBe("該当するタスクはありません");
    });

    it("期限切れタスクを適切にフォーマットする", () => {
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
      const todos: Todo[] = [
        {
          id: "1",
          title: "期限切れタスク",
          completed: false,
          endAt: yesterday,
        },
      ];

      const result = formatTodosAsText(todos);
      expect(result).toContain("【期限切れ】");
      expect(result).toContain("期限切れタスク");
      expect(result).toContain("期限:");
    });

    it("今日期限タスクを適切にフォーマットする", () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const todos: Todo[] = [
        {
          id: "1",
          title: "今日期限タスク",
          completed: false,
          endAt: today.getTime(),
        },
      ];

      const result = formatTodosAsText(todos);
      expect(result).toContain("【本日期限】");
      expect(result).toContain("今日期限タスク");
    });

    it("メモとURLがある場合は含める", () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const todos: Todo[] = [
        {
          id: "1",
          title: "テストタスク",
          completed: false,
          endAt: today.getTime(),
          note: "テストメモ",
          url: "https://example.com",
        },
      ];

      const result = formatTodosAsText(todos);
      expect(result).toContain("メモ: テストメモ");
      expect(result).toContain("URL: https://example.com");
    });

    it("複数タスクを改行区切りでフォーマットする", () => {
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const todos: Todo[] = [
        { id: "1", title: "タスク1", completed: false, endAt: yesterday },
        { id: "2", title: "タスク2", completed: false, endAt: today.getTime() },
      ];

      const result = formatTodosAsText(todos);
      expect(result).toContain("タスク1");
      expect(result).toContain("タスク2");
      expect(result.split("\n\n").length).toBe(2);
    });
  });
}
