import { TodoCopyButton } from "../features/todo/copyButton/todoCopyButton";
import { TodoFilter } from "../features/todo/filter/todoFilter";
import { TodoForm } from "../features/todo/form/todoForm";
import { TodoList } from "../features/todo/todoList";
import { TodoStatus } from "../features/todo/todoStatus";

export const App = () => {
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-8">
      <h1 className="mb-2 font-bold text-4xl text-cyan-700">My ToDo</h1>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="space-y-8">
          <TodoStatus />
          <TodoForm />
        </div>
        <div className="space-y-8">
          <TodoCopyButton />
          <TodoFilter />
          <TodoList />
        </div>
      </div>
    </main>
  );
};
