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
  none: () => 0,
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

export const useFilteredTodos = (todos: Todo[]) => {
  const { filter, sort } = useFilterAtom();

  const filteredAndSortedTodos = useMemo(() => {
    const filterFn = filterFunctions[filter] ?? filterFunctions.all;
    const sortFn = sortCompareFunctions[sort] ?? sortCompareFunctions.none;

    return todos.filter(filterFn).sort(sortFn);
  }, [todos, filter, sort]);

  return filteredAndSortedTodos;
};
