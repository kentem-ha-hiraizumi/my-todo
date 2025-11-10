import { TodoFilter } from "../features/todo/filter/todoFilter";
import { TodoForm } from "../features/todo/form/todoForm";
import { TodoList } from "../features/todo/todoList";
import { TodoStatus } from "../features/todo/todoStatus";

export const App = () => {
  return (
    <main className="p-8 flex flex-col gap-6 items-center min-h-screen">
      <h1 className="text-4xl font-bold text-cyan-700 mb-2">My ToDo</h1>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="space-y-8">
          <TodoStatus />
          <TodoForm />
        </div>
        <div className="space-y-8">
          <TodoFilter />
          <TodoList />
        </div>
      </div>
    </main>
  );
};
