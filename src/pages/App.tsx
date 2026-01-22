import { useFilterAtom } from "../features/todo/filter/filterAtom";
import { TodoFilter } from "../features/todo/filter/todoFilter";
import { TodoForm } from "../features/todo/form/todoForm";
import { BulkActions } from "../features/todo/selection/bulkActions";
import { TodoList } from "../features/todo/todoList";

export const App = () => {
  const { filter } = useFilterAtom();

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <h1 className="mb-2 font-bold text-4xl text-cyan-700">My ToDo</h1>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="space-y-8">
          <TodoForm />
          <BulkActions currentFilter={filter} />
        </div>
        <div className="space-y-8">
          <TodoFilter />
          <TodoList />
        </div>
      </div>
    </main>
  );
};
