import { type Todo, useTodoAtom } from "../todoAtom";

export const TodoForm = () => {
  const { addTodo } = useTodoAtom();

  const onSubmit = async (data: FormData) => {
    const { title, note, endAt, url } = Object.fromEntries(
      data.entries(),
    ) as unknown as Todo;

    addTodo({
      title,
      endAt: endAt ? new Date(endAt).getTime() : undefined,
      note: note,
      url: url,
    });
  };

  return (
    <form
      className="w-120 max-w-[90%] rounded-xl border border-cyan-100 bg-white/80 p-6 shadow-lg backdrop-blur-sm"
      action={onSubmit}
    >
      <label className="mb-4 block">
        <span className="mb-2 block font-medium text-slate-700 text-sm">
          名前
        </span>
        <input
          type="text"
          name="title"
          className="w-full rounded-lg border-2 border-zinc-400 p-3 transition-colors duration-200 focus:border-cyan-300 focus:outline-none"
          placeholder="ToDo名を入力"
          maxLength={100}
          required
        />
      </label>
      <label className="mb-4 block">
        <span className="mb-2 block font-medium text-slate-700 text-sm">
          詳細
        </span>
        <textarea
          name="note"
          rows={4}
          className="w-full resize-none rounded-lg border-2 border-zinc-400 p-3 transition-colors duration-200 focus:border-cyan-300 focus:outline-none"
          placeholder="ToDoの詳細"
          maxLength={1000}
          required
        />
      </label>
      <label className="mb-4 block">
        <span className="mb-2 block font-medium text-slate-700 text-sm">
          期日
        </span>
        <input
          type="date"
          name="endAt"
          className="w-full rounded-lg border-2 border-zinc-400 p-3 transition-colors duration-200 focus:border-cyan-300 focus:outline-none"
        />
      </label>
      <label className="mb-4 block">
        <span className="mb-2 block font-medium text-slate-700 text-sm">
          リンク（URL）
        </span>
        <input
          type="url"
          name="url"
          className="w-full rounded-lg border-2 border-zinc-400 p-3 transition-colors duration-200 focus:border-cyan-300 focus:outline-none"
          placeholder="https://example.com"
        />
      </label>
      <button
        type="submit"
        className="mt-2 w-full cursor-pointer rounded-lg bg-cyan-500 px-6 py-3 font-medium text-white shadow-md transition-colors duration-200 hover:bg-cyan-600"
      >
        ToDoを追加
      </button>
    </form>
  );
};
