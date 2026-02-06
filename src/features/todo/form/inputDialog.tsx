import { useRef } from "react";
import { type Todo, useTodoAtom } from "../todoAtom";

export const InputDialogButton = () => {
  return (
    <>
      <InputDialog />
      {/* @ts-ignore command属性 */}
      <button
        // @ts-expect-error
        command="show-modal"
        commandfor="input-dialog"
        type="button"
        className="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 font-bold text-white text-xl leading-10 shadow-sm transition-colors duration-200 hover:bg-sky-600"
      >
        作成
      </button>
    </>
  );
};

const InputDialog = () => {
  const { addTodo } = useTodoAtom();
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

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

    formRef.current?.reset();
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      id="input-dialog"
      closedby="any"
      className="fixed inset-0 m-auto w-120 max-w-[90%] rounded-xl border-none bg-white/95 p-0 shadow-2xl backdrop-blur-sm backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between border-cyan-100 border-b p-5">
        <h2 className="font-bold text-cyan-700 text-lg">ToDoを追加</h2>
      </div>
      <form ref={formRef} className="p-6" action={onSubmit}>
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
    </dialog>
  );
};
