import { useRef, useState } from "react";
import { useTodoAtom } from "./todoAtom";

export const TodoForm = () => {
  const { addTodo } = useTodoAtom();
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (data: FormData) => {
    const formData = Object.fromEntries(data.entries());
    const title = formData.title as string;
    const endAtStr = formData.endAt as string;

    // バリデーション
    setError("");

    // タイトルの文字数チェック（1-100文字）
    if (title.length === 0) {
      setError("タイトルを入力してください");
      return;
    }
    if (title.length > 100) {
      setError("タイトルは100文字以内で入力してください");
      return;
    }

    // 過去の日付チェック
    if (endAtStr) {
      const endAt = new Date(endAtStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (endAt < today) {
        setError("過去の日付は設定できません");
        return;
      }
    }

    addTodo({
      title,
      endAt: endAtStr ? new Date(endAtStr).getTime() : undefined,
    });

    // フォームをリセット
    formRef.current?.reset();
  };

  return (
    <form
      ref={formRef}
      className="p-4 bg-slate-100 w-120 max-w-[90%] rounded"
      action={onSubmit}
    >
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}
      <label>
        名前
        <input
          type="text"
          name="title"
          className="p-2 border-2 border-slate-300 rounded w-full"
          placeholder="ToDo名を入力"
          maxLength={100}
          required
        />
      </label>
      <label>
        期日
        <input
          type="date"
          name="endAt"
          className="p-2 border-2 border-slate-300 rounded w-full"
        />
      </label>
      <button
        type="submit"
        className="mt-4 px-4 py-2 w-full cursor-pointer bg-teal-600 text-white rounded hover:bg-teal-700"
      >
        ToDoを追加
      </button>
    </form>
  );
};
