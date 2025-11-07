import { atom, useAtom } from "jotai";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  endAt?: Date;
};

const todoAtom = atom<Todo[]>([]);

export const useTodoAtom = () => {
  const [todos, setTodos] = useAtom(todoAtom);

  const addTodo = (newTodo: Omit<Todo, "id" | "completed">) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { ...newTodo, id: crypto.randomUUID(), completed: false },
    ]);
  };
  const removeTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };
  const setCompleted = (id: string, completed: boolean) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)),
    );
  };

  return { todos, addTodo, removeTodo, setCompleted };
};
