/** Todoアイテムのバリエーション型 */
export type TodoVariant = "default" | "completed" | "overdue" | "dueToday";

/**
 * Todoの状態からvariantを取得する
 * @param completed - 完了しているかどうか
 * @param overdue - 期限超過しているかどうか
 * @param dueToday - 本日期限かどうか
 * @returns TodoVariant
 */
export const getTodoVariant = (
  completed: boolean,
  overdue: boolean,
  dueToday: boolean,
): TodoVariant => {
  if (completed) return "completed";
  if (overdue) return "overdue";
  if (dueToday) return "dueToday";
  return "default";
};

/**
 * Todoアイテムコンテナのスタイルを取得する
 * @param variant - Todoのバリエーション
 * @returns Tailwind CSSクラス文字列
 */
export const getTodoContainerStyle = (variant: TodoVariant): string => {
  const styles: Record<TodoVariant, string> = {
    completed: "bg-slate-50/80",
    overdue: "border-2 border-red-300 bg-red-50",
    dueToday: "border-2 border-blue-300 bg-blue-50",
    default: "border border-cyan-100/50 bg-white/90",
  };
  return styles[variant];
};

/**
 * Todoタイトルのスタイルを取得する
 * @param variant - Todoのバリエーション
 * @param hasUrl - URLが存在するかどうか
 * @returns Tailwind CSSクラス文字列
 */
export const getTodoTitleStyle = (
  variant: TodoVariant,
  hasUrl = false,
): string => {
  const baseStyle = "font-semibold text-lg";
  const urlStyle = hasUrl ? "hover:underline" : "";

  const variantStyles: Record<TodoVariant, string> = {
    completed: "text-slate-400 line-through",
    overdue: "font-bold text-red-600",
    dueToday: hasUrl ? "font-bold text-sky-500" : "font-bold text-blue-600",
    default: hasUrl ? "text-sky-500" : "text-slate-700",
  };

  return `${baseStyle} ${variantStyles[variant]} ${urlStyle}`.trim();
};

/**
 * Todo期日のスタイルを取得する
 * @param variant - Todoのバリエーション
 * @returns Tailwind CSSクラス文字列
 */
export const getTodoDateStyle = (variant: TodoVariant): string => {
  const baseStyle = "text-sm";

  const variantStyles: Record<TodoVariant, string> = {
    completed: "text-slate-500",
    overdue: "font-semibold text-red-500",
    dueToday: "font-semibold text-blue-500",
    default: "text-slate-500",
  };

  return `${baseStyle} ${variantStyles[variant]}`.trim();
};

// インソーステスト
if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("getTodoVariant", () => {
    it("完了している場合はcompletedを返す", () => {
      expect(getTodoVariant(true, false, false)).toBe("completed");
      expect(getTodoVariant(true, true, false)).toBe("completed");
      expect(getTodoVariant(true, false, true)).toBe("completed");
    });

    it("完了していないが期限超過している場合はoverdueを返す", () => {
      expect(getTodoVariant(false, true, false)).toBe("overdue");
    });

    it("完了していないが本日期限の場合はdueTodayを返す", () => {
      expect(getTodoVariant(false, false, true)).toBe("dueToday");
    });

    it("それ以外の場合はdefaultを返す", () => {
      expect(getTodoVariant(false, false, false)).toBe("default");
    });
  });

  describe("getTodoContainerStyle", () => {
    it("completedバリアントでは適切なスタイルを返す", () => {
      expect(getTodoContainerStyle("completed")).toBe("bg-slate-50/80");
    });

    it("overdueバリアントでは適切なスタイルを返す", () => {
      expect(getTodoContainerStyle("overdue")).toBe(
        "border-2 border-red-300 bg-red-50",
      );
    });

    it("dueTodayバリアントでは適切なスタイルを返す", () => {
      expect(getTodoContainerStyle("dueToday")).toBe(
        "border-2 border-blue-300 bg-blue-50",
      );
    });

    it("defaultバリアントでは適切なスタイルを返す", () => {
      expect(getTodoContainerStyle("default")).toBe(
        "border border-cyan-100/50 bg-white/90",
      );
    });
  });

  describe("getTodoTitleStyle", () => {
    it("completedバリアントでは打消し線スタイルを返す", () => {
      const style = getTodoTitleStyle("completed");
      expect(style).toContain("text-slate-400");
      expect(style).toContain("line-through");
    });

    it("overdueバリアントでは赤字太字スタイルを返す", () => {
      const style = getTodoTitleStyle("overdue");
      expect(style).toContain("font-bold");
      expect(style).toContain("text-red-600");
    });

    it("URLがある場合はhover:underlineを含む", () => {
      const style = getTodoTitleStyle("default", true);
      expect(style).toContain("hover:underline");
    });

    it("URLがない場合はhover:underlineを含まない", () => {
      const style = getTodoTitleStyle("default", false);
      expect(style).not.toContain("hover:underline");
    });
  });

  describe("getTodoDateStyle", () => {
    it("overdueバリアントでは赤字のセミボールドスタイルを返す", () => {
      const style = getTodoDateStyle("overdue");
      expect(style).toContain("font-semibold");
      expect(style).toContain("text-red-500");
    });

    it("dueTodayバリアントでは青字のセミボールドスタイルを返す", () => {
      const style = getTodoDateStyle("dueToday");
      expect(style).toContain("font-semibold");
      expect(style).toContain("text-blue-500");
    });

    it("defaultとcompletedバリアントではtext-slate-500を返す", () => {
      expect(getTodoDateStyle("default")).toContain("text-slate-500");
      expect(getTodoDateStyle("completed")).toContain("text-slate-500");
    });
  });
}
