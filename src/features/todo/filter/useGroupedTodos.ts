import { useMemo } from "react";
import type { Todo } from "../todoAtom";
import { useFilterAtom } from "./filterAtom";

// フィルター関数のマップ
const filterFunctions: Record<string, (todo: Todo) => boolean> = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
};

// ソート比較関数のマップ
const sortCompareFunctions: Record<string, (a: Todo, b: Todo) => number> = {
  "date-asc": (a, b) => {
    if (!a.endAt) return 1;
    if (!b.endAt) return -1;
    return a.endAt - b.endAt;
  },
  "date-desc": (a, b) => {
    if (!a.endAt) return -1;
    if (!b.endAt) return 1;
    return b.endAt - a.endAt;
  },
};

// 年・月の2階層グループ化フック
export const useGroupedTodos = (todos: Todo[]) => {
  const { filter, sort } = useFilterAtom();

  const groupedTodos = useMemo(() => {
    // フィルタリング
    const filterFn = filterFunctions[filter] ?? filterFunctions.all;
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

    // グループ内のTodoをソート
    const sortFn = sortCompareFunctions[sort];
    for (const year of Object.keys(grouped)) {
      for (const month of Object.keys(grouped[year])) {
        grouped[year][month].sort(sortFn);
      }
    }

    // 年のソート順を決定
    const sortedYears = Object.keys(grouped).sort((a, b) => {
      if (sort === "date-asc") {
        // 古い年→新しい年、期限なしは末尾
        if (a === "no-date") return 1;
        if (b === "no-date") return -1;
        return Number(a) - Number(b);
      }
      // date-desc: 期限なし→新しい年→古い年
      if (a === "no-date") return -1;
      if (b === "no-date") return 1;
      return Number(b) - Number(a);
    });

    // 配列形式で返す（順序を確実に保持）
    return sortedYears.map((year) => {
      if (year === "no-date") {
        return {
          year,
          months: [{ month: "no-date", todos: grouped[year]["no-date"] }],
        };
      }

      // 月をソート（date-asc: 1月→12月、date-desc: 12月→1月）
      const months = Object.keys(grouped[year])
        .sort((a, b) => {
          if (sort === "date-asc") {
            return Number(a) - Number(b);
          }
          return Number(b) - Number(a);
        })
        .map((month) => ({
          month,
          todos: grouped[year][month],
        }));

      return { year, months };
    });
  }, [todos, filter, sort]);

  return groupedTodos;
};
