import { useTodoAtom } from "../todoAtom";

export const TodoForm = () => {
  const { addTodo } = useTodoAtom();

  const onSubmit = async (data: FormData) => {
    const formData = Object.fromEntries(data.entries());
    const title = formData.title as string;
    const endAtStr = formData.endAt as string;
    const url = formData.url as string;

    addTodo({
      title,
      endAt: endAtStr ? new Date(endAtStr).getTime() : undefined,
      url: url || undefined,
    });
  };

  return (
    <form
      className="p-6 bg-white/80 backdrop-blur-sm w-120 max-w-[90%] rounded-xl shadow-lg border border-cyan-100"
      action={onSubmit}
    >
      <label className="block mb-4">
        <span className="text-slate-700 font-medium text-sm mb-2 block">
          名前
        </span>
        <input
          type="text"
          name="title"
          className="p-3 border-2 border-cyan-200 rounded-lg w-full focus:border-cyan-400 focus:outline-none transition-colors duration-200"
          placeholder="ToDo名を入力"
          maxLength={100}
          required
        />
      </label>
      <label className="block mb-4">
        <span className="text-slate-700 font-medium text-sm mb-2 block">
          期日
        </span>
        <input
          type="date"
          name="endAt"
          className="p-3 border-2 border-cyan-200 rounded-lg w-full focus:border-cyan-400 focus:outline-none transition-colors duration-200"
        />
      </label>
      <label className="block mb-4">
        <span className="text-slate-700 font-medium text-sm mb-2 block">
          リンク（URL）
        </span>
        <input
          type="url"
          name="url"
          className="p-3 border-2 border-cyan-200 rounded-lg w-full focus:border-cyan-400 focus:outline-none transition-colors duration-200"
          placeholder="https://example.com"
        />
      </label>
      <button
        type="submit"
        className="mt-2 px-6 py-3 w-full cursor-pointer bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200 shadow-md font-medium"
      >
        ToDoを追加
      </button>
    </form>
  );
};
