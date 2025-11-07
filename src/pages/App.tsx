import { TodoForm } from "../features/todo/todoForm";
import { TodoList } from "../features/todo/todoList";

export const App = () => {
  return (
    <main className="p-4 flex flex-col gap-4 items-center">
      <h1 className="text-3xl font-bold text-sky-800">My ToDo</h1>
      <TodoForm />
      <TodoList />
    </main>
  );
};
