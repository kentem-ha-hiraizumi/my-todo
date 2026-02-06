import { useFilterAtom } from "../features/todo/filter/filterAtom";
import { TodoFilter } from "../features/todo/filter/todoFilter";
import { InputDialogButton } from "../features/todo/form/inputDialog";
import { useInputModalTrigger } from "../features/todo/form/useInputModalTrigger";
import { BulkActions } from "../features/todo/selection/bulkActions";
import { TodoList } from "../features/todo/todoList";

export const App = () => {
  const { filter } = useFilterAtom();
  useInputModalTrigger();

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 px-4 py-8 sm:px-8">
      <h1 className="mb-2 font-bold text-4xl text-cyan-700">My ToDo</h1>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex flex-wrap items-center justify-center gap-8 rounded-lg bg-white/60 p-4 shadow-md">
          <InputDialogButton />
          <TodoFilter />
        </div>
        <BulkActions currentFilter={filter} />
      </div>
      <TodoList />
    </main>
  );
};
