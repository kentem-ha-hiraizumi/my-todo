import { useEffect, useRef } from "react";
import type { Todo } from "../todoAtom";

type EditDialogProps = {
  todo: Todo | null;
  onUpdate: (id: string, data: Partial<Omit<Todo, "id" | "completed">>) => void;
  onClose: () => void;
};

export const EditDialog = ({ todo, onUpdate, onClose }: EditDialogProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // todoが設定されたらダイアログを開く
  useEffect(() => {
    if (todo) {
      dialogRef.current?.showModal();
    }
  }, [todo]);

  const onSubmit = async (data: FormData) => {
    if (!todo) return;

    const { title, note, endAt, url } = Object.fromEntries(
      data.entries(),
    ) as unknown as Todo;

    onUpdate(todo.id, {
      title,
      note: note || undefined,
      endAt: endAt ? new Date(endAt).getTime() : undefined,
      url: url || undefined,
    });

    formRef.current?.reset();
    dialogRef.current?.close();
  };

  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  if (!todo) return null;

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      onClose={handleClose}
      className="fixed inset-0 m-auto w-120 max-w-[90%] rounded-xl border-none bg-white/95 p-0 shadow-2xl backdrop-blur-sm backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between border-cyan-100 border-b p-5">
        <h2 className="font-bold text-cyan-700 text-lg">ToDoを編集</h2>
      </div>
      <form ref={formRef} className="p-6" action={onSubmit}>
        <label className="mb-4 block">
          <span className="mb-2 block font-medium text-slate-700 text-sm">
            名前
          </span>
          <input
            type="text"
            name="title"
            defaultValue={todo.title}
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
            defaultValue={todo.note ?? ""}
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
            defaultValue={
              todo.endAt ? new Date(todo.endAt).toISOString().split("T")[0] : ""
            }
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
            defaultValue={todo.url ?? ""}
            className="w-full rounded-lg border-2 border-zinc-400 p-3 transition-colors duration-200 focus:border-cyan-300 focus:outline-none"
            placeholder="https://example.com"
          />
        </label>
        <button
          type="submit"
          className="mt-2 w-full cursor-pointer rounded-lg bg-cyan-500 px-6 py-3 font-medium text-white shadow-md transition-colors duration-200 hover:bg-cyan-600 active:bg-cyan-700"
        >
          保存
        </button>
      </form>
    </dialog>
  );
};
