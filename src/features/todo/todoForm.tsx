import { useTodoAtom } from "./todoAtom";

export const TodoForm = () => {
  const { addTodo } = useTodoAtom();
  const onSubmit = async (data: FormData) => {
    const formData = Object.fromEntries(data.entries());

    addTodo({
      title: formData.title as string,
      endAt: formData.endAt ? new Date(formData.endAt as string) : undefined,
    });
  };

  return (
    <form
      className="p-4 bg-slate-100 w-120 max-w-[90%] rounded"
      action={onSubmit}
    >
      <label>
        名前
        <input
          type="text"
          name="title"
          className="p-2 border-2 border-slate-300 rounded w-full"
          placeholder="ToDo名を入力"
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
