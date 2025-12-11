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
 * タスクをプレーンテキスト形式に変換する（markdown順序リスト、タイトルのみ）
 * @param todos - タスクの配列
 * @returns プレーンテキスト形式の文字列
 */
export const formatTodosAsText = (todos: Todo[]): string => {
  if (todos.length === 0) {
    return "該当するタスクはありません";
  }

  // 期限切れと本日期限に分離
  const overdueTodos = todos.filter((todo) =>
    isOverdue(todo.endAt, todo.completed),
  );
  const dueTodayTodos = todos.filter((todo) =>
    isDueToday(todo.endAt, todo.completed),
  );

  // 期限切れ → 本日期限の順番でマージ
  const sortedTodos = [...overdueTodos, ...dueTodayTodos];

  // markdown順序リスト形式でタイトルのみ出力
  return sortedTodos
    .map((todo, index) => `${index + 1}. ${todo.title}`)
    .join("\n");
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

    it("期限切れタスクをmarkdown順序リスト形式でフォーマットする", () => {
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
      expect(result).toBe("1. 期限切れタスク");
    });

    it("今日期限タスクをmarkdown順序リスト形式でフォーマットする", () => {
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
      expect(result).toBe("1. 今日期限タスク");
    });

    it("タイトルのみを出力し、メモとURLは含めない", () => {
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
      expect(result).toBe("1. テストタスク");
      expect(result).not.toContain("メモ");
      expect(result).not.toContain("URL");
    });

    it("期限切れ→本日期限の順で複数タスクをフォーマットする", () => {
      const yesterday = Date.now() - 24 * 60 * 60 * 1000;
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
          title: "期限切れタスク",
          completed: false,
          endAt: yesterday,
        },
      ];

      const result = formatTodosAsText(todos);
      expect(result).toBe("1. 期限切れタスク\n2. 今日期限タスク");
    });
  });
}
