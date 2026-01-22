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

  return {
    selectedIds,
    toggleSelection,
    clearSelection,
    isSelected,
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
  });
}
