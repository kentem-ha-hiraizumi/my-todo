import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type FilterType = "all" | "active" | "completed";
export type SortType = "date-asc" | "date-desc";

const filterAtom = atomWithStorage<FilterType>("todo-filter", "all");
const sortAtom = atomWithStorage<SortType>("todo-sort", "date-asc");

export const useFilterAtom = () => {
  const [filter, setFilter] = useAtom(filterAtom);
  const [sort, setSort] = useAtom(sortAtom);

  return { filter, setFilter, sort, setSort };
};
