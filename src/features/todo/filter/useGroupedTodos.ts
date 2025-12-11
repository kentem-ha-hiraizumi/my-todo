import { useMemo } from "react";
import type { Todo } from "../todoAtom";
import { useFilterAtom } from "./filterAtom";

// フィルター関数のマップ
const filterFunctions: Record<string, (todo: Todo) => boolean> = {
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
};

// ソート比較関数（activeは昇順、completedは降順）
const getSortCompareFunction = (filter: string) => {
  if (filter === "completed") {
    // 完了済み：期日の遅い順（最近のもの）
    return (a: Todo, b: Todo) => {
      if (!a.endAt) return -1;
      if (!b.endAt) return 1;
      return b.endAt - a.endAt;
    };
  }
  // 未完了：期日の早い順
  return (a: Todo, b: Todo) => {
    if (!a.endAt) return 1;
    if (!b.endAt) return -1;
    return a.endAt - b.endAt;
  };
};

// 年・月の2階層グループ化フック
export const useGroupedTodos = (todos: Todo[]) => {
  const { filter } = useFilterAtom();

  const groupedTodos = useMemo(() => {
    // フィルタリング
    const filterFn = filterFunctions[filter];
    const filtered = todos.filter(filterFn);

    // 年・月でグループ化
    const grouped: { [year: string]: { [month: string]: Todo[] } } = {};

    for (const todo of filtered) {
      if (!todo.endAt) {
        // 期限なし
        if (!grouped["no-date"]) {
          grouped["no-date"] = { "no-date": [] };
        }
        grouped["no-date"]["no-date"].push(todo);
      } else {
        // 期限あり
        const date = new Date(todo.endAt);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString();

        if (!grouped[year]) {
          grouped[year] = {};
        }
        if (!grouped[year][month]) {
          grouped[year][month] = [];
        }
        grouped[year][month].push(todo);
      }
    }

    // グループ内のTodoをソート（フィルタータイプに応じて自動決定）
    const sortFn = getSortCompareFunction(filter);
    for (const year of Object.keys(grouped)) {
      for (const month of Object.keys(grouped[year])) {
        grouped[year][month].sort(sortFn);
      }
    }

    // 年のソート順を決定
    const sortedYears = Object.keys(grouped).sort((a, b) => {
      if (filter === "completed") {
        // 完了済み：期限なし→新しい年→古い年
        if (a === "no-date") return -1;
        if (b === "no-date") return 1;
        return Number(b) - Number(a);
      }
      // 未完了：古い年→新しい年、期限なしは末尾
      if (a === "no-date") return 1;
      if (b === "no-date") return -1;
      return Number(a) - Number(b);
    });

    // 配列形式で返す（順序を確実に保持）
    return sortedYears.map((year) => {
      if (year === "no-date") {
        return {
          year,
          months: [{ month: "no-date", todos: grouped[year]["no-date"] }],
        };
      }

      // 月をソート（active: 1月→12月、completed: 12月→1月）
      const months = Object.keys(grouped[year])
        .sort((a, b) => {
          if (filter === "completed") {
            return Number(b) - Number(a);
          }
          return Number(a) - Number(b);
        })
        .map((month) => ({
          month,
          todos: grouped[year][month],
        }));

      return { year, months };
    });
  }, [todos, filter]);

  return groupedTodos;
};

// テストコード（ソート関数のロジックをテスト）
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("getSortCompareFunction", () => {
    it("activeフィルターでは期日の早い順にソートされること", () => {
      const todos: Todo[] = [
        {
          id: "1",
          title: "Task 1",
          completed: false,
          endAt: new Date("2025-12-31").getTime(),
        },
        {
          id: "2",
          title: "Task 2",
          completed: false,
          endAt: new Date("2025-01-15").getTime(),
        },
        {
          id: "3",
          title: "Task 3",
          completed: false,
          endAt: new Date("2025-06-10").getTime(),
        },
      ];

      const sortFn = getSortCompareFunction("active");
      const sorted = [...todos].sort(sortFn);

      expect(sorted[0].id).toBe("2"); // 2025-01-15
      expect(sorted[1].id).toBe("3"); // 2025-06-10
      expect(sorted[2].id).toBe("1"); // 2025-12-31
    });

    it("completedフィルターでは期日の遅い順にソートされること", () => {
      const todos: Todo[] = [
        {
          id: "1",
          title: "Task 1",
          completed: true,
          endAt: new Date("2025-01-15").getTime(),
        },
        {
          id: "2",
          title: "Task 2",
          completed: true,
          endAt: new Date("2025-12-31").getTime(),
        },
        {
          id: "3",
          title: "Task 3",
          completed: true,
          endAt: new Date("2025-06-10").getTime(),
        },
      ];

      const sortFn = getSortCompareFunction("completed");
      const sorted = [...todos].sort(sortFn);

      expect(sorted[0].id).toBe("2"); // 2025-12-31
      expect(sorted[1].id).toBe("3"); // 2025-06-10
      expect(sorted[2].id).toBe("1"); // 2025-01-15
    });

    it("activeフィルターでは期限なしのタスクが末尾に配置されること", () => {
      const todos: Todo[] = [
        { id: "1", title: "Task 1", completed: false },
        {
          id: "2",
          title: "Task 2",
          completed: false,
          endAt: new Date("2025-06-10").getTime(),
        },
        {
          id: "3",
          title: "Task 3",
          completed: false,
          endAt: new Date("2025-01-15").getTime(),
        },
      ];

      const sortFn = getSortCompareFunction("active");
      const sorted = [...todos].sort(sortFn);

      expect(sorted[0].id).toBe("3"); // 2025-01-15
      expect(sorted[1].id).toBe("2"); // 2025-06-10
      expect(sorted[2].id).toBe("1"); // 期限なし
    });

    it("completedフィルターでは期限なしのタスクが先頭に配置されること", () => {
      const todos: Todo[] = [
        {
          id: "1",
          title: "Task 1",
          completed: true,
          endAt: new Date("2025-06-10").getTime(),
        },
        { id: "2", title: "Task 2", completed: true },
        {
          id: "3",
          title: "Task 3",
          completed: true,
          endAt: new Date("2025-01-15").getTime(),
        },
      ];

      const sortFn = getSortCompareFunction("completed");
      const sorted = [...todos].sort(sortFn);

      expect(sorted[0].id).toBe("2"); // 期限なし
      expect(sorted[1].id).toBe("1"); // 2025-06-10
      expect(sorted[2].id).toBe("3"); // 2025-01-15
    });
  });

  describe("filterFunctions", () => {
    it("activeフィルターは未完了タスクのみを返すこと", () => {
      const todos: Todo[] = [
        { id: "1", title: "Task 1", completed: false },
        { id: "2", title: "Task 2", completed: true },
        { id: "3", title: "Task 3", completed: false },
      ];

      const filtered = todos.filter(filterFunctions.active);
      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => !t.completed)).toBe(true);
    });

    it("completedフィルターは完了タスクのみを返すこと", () => {
      const todos: Todo[] = [
        { id: "1", title: "Task 1", completed: false },
        { id: "2", title: "Task 2", completed: true },
        { id: "3", title: "Task 3", completed: true },
      ];

      const filtered = todos.filter(filterFunctions.completed);
      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => t.completed)).toBe(true);
    });
  });
}
