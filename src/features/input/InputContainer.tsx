import { useInputAtom } from "./inputAtom";

export const InputContainer = () => {
  const { setInputValue } = useInputAtom();

  const onSubmit = (data: FormData) => {
    const formData = Object.fromEntries(data.entries());

    setInputValue(formData.title as string);
  };

  return (
    <form className="flex gap-4" action={onSubmit}>
      <input
        name="title"
        type="text"
        className="rounded border-2 border-slate-500 p-2"
      />
      <button
        type="submit"
        className="rounded bg-slate-700 px-4 py-2 text-white"
      >
        Submit
      </button>
    </form>
  );
};
