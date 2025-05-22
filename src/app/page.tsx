"use client"
import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodos() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/todos");
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
        setError("Failed to load todos. Please try again");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if(!newTodo) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: newTodo }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const todosRes = await fetch("/api/todos");
      const todosData = await todosRes.json();
      setTodos(todosData);
      setNewTodo("");
    } catch (error) {
      console.error("Failed to add todo:", error);
      setError("Failed to add todo. Please try again");
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await fetch("/api/todos", {
        method: "PUT",
        body: JSON.stringify({ id, completed: !completed }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error) {
      console.error("Failed to update todo:", error);
      setError("Failed to update todo. Please try again");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
      setError("Failed to delete todo. Please try again");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800">TODO App!</h1>
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded flex justify-between items-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="text-red-700 font-bold"
            aria-label="Dismiss error"
          >
            x
          </button>
        </div>
      )}
      <form 
        className="flex mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 border p-2 rounded-l text-gray-800"
          placeholder="New todo..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
          Add
        </button>
      </form>
      {isLoading ? (
        <div className="mt-4 text-center text-gray-500">Loading todos...</div>
      ) : (
        <ul className="mt-4">
          {todos.length === 0 && (
            <li key={-1} className="p-2 text-center text-gray-500">No todos. Add one above!</li>
          )}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <span
                className={`flex-1 cursor-pointer text-gray-500 ${
                  todo.completed ? "line-through" : ""
                }`}
                onClick={() => toggleTodo(todo.id, todo.completed)}
                role="checkbox"
                aria-checked={todo.completed}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    toggleTodo(todo.id, todo.completed)
                  }
                }}
              >
                {todo.title}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-500 text-white p-1 rounded"
                aria-label={`Delete ${todo.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}