import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type FilterType = "all" | "active" | "completed";
export type SortType = "none" | "date-asc" | "date-desc";

const filterAtom = atomWithStorage<FilterType>("todo-filter", "all");
const sortAtom = atomWithStorage<SortType>("todo-sort", "none");

export const useFilterAtom = () => {
  const [filter, setFilter] = useAtom(filterAtom);
  const [sort, setSort] = useAtom(sortAtom);

  return { filter, setFilter, sort, setSort };
};
