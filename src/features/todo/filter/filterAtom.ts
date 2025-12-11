import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type FilterType = "active" | "completed";

const filterAtom = atomWithStorage<FilterType>("todo-filter", "active");

export const useFilterAtom = () => {
  const [filter, setFilter] = useAtom(filterAtom);

  return { filter, setFilter };
};
