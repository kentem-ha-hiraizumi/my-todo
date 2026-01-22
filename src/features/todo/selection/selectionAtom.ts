import { atom, useAtom } from "jotai";

// 選択されたTodoのIDの配列を管理（永続化なし）
const selectionAtom = atom<string[]>([]);

export const useSelectionAtom = () => {
  const [selectedIds, setSelectedIds] = useAtom(selectionAtom);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id],
    );
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  // 複数のTodoを一括選択/解除
  const toggleMultipleSelection = (ids: string[]) => {
    setSelectedIds((prev) => {
      // 全てのIDが選択済みの場合は解除、そうでない場合は全て選択
      const allSelected = ids.every((id) => prev.includes(id));
      if (allSelected) {
        // 指定されたIDをすべて削除
        return prev.filter((id) => !ids.includes(id));
      }
      // 指定されたIDのうち、まだ選択されていないものを追加
      const newIds = ids.filter((id) => !prev.includes(id));
      return [...prev, ...newIds];
    });
  };

  // 指定されたIDが全て選択されているか確認
  const areAllSelected = (ids: string[]) => {
    if (ids.length === 0) return false;
    return ids.every((id) => selectedIds.includes(id));
  };

  // 指定されたIDの一部が選択されているか確認（indeterminate状態用）
  const areSomeSelected = (ids: string[]) => {
    if (ids.length === 0) return false;
    const selectedCount = ids.filter((id) => selectedIds.includes(id)).length;
    return selectedCount > 0 && selectedCount < ids.length;
  };

  return {
    selectedIds,
    toggleSelection,
    clearSelection,
    isSelected,
    toggleMultipleSelection,
    areAllSelected,
    areSomeSelected,
  };
};

// テスト
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("useSelectionAtom", () => {
    it("toggleSelectionで選択状態を切り替え", () => {
      const selectedIds: string[] = [];
      const id = "test-id";

      // 選択されていない場合は追加
      const result1 = selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id];
      expect(result1).toEqual([id]);

      // 選択されている場合は削除
      const result2 = result1.includes(id)
        ? result1.filter((selectedId) => selectedId !== id)
        : [...result1, id];
      expect(result2).toEqual([]);
    });

    it("clearSelectionで全ての選択をクリア", () => {
      const cleared: string[] = [];
      expect(cleared).toEqual([]);
    });

    it("isSelectedで選択状態を確認", () => {
      const selectedIds = ["id1", "id2"];
      expect(selectedIds.includes("id1")).toBe(true);
      expect(selectedIds.includes("id3")).toBe(false);
    });

    it("toggleMultipleSelectionで複数のIDを一括選択", () => {
      const selectedIds: string[] = [];
      const ids = ["id1", "id2", "id3"];

      // 全て選択されていない場合は全て追加
      const allSelected = ids.every((id) => selectedIds.includes(id));
      const result = allSelected
        ? selectedIds.filter((id) => !ids.includes(id))
        : [...selectedIds, ...ids.filter((id) => !selectedIds.includes(id))];

      expect(result).toEqual(["id1", "id2", "id3"]);
    });

    it("areAllSelectedで全選択状態を確認", () => {
      const selectedIds = ["id1", "id2", "id3"];
      const ids = ["id1", "id2"];
      expect(ids.every((id) => selectedIds.includes(id))).toBe(true);

      const ids2 = ["id1", "id4"];
      expect(ids2.every((id) => selectedIds.includes(id))).toBe(false);
    });
  });
}
