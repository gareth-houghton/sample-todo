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

  useEffect(() => {
    async function fetchTodos() {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    }
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if(!newTodo) return;
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title: newTodo }),
      headers: { "Content-Type": "application/json" },
    });
    setNewTodo("");
    location.reload();
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch("/api/todos", {
      method: "PUT",
      body: JSON.stringify({ id, completed: !completed }),
      headers: { "Content-Type": "application/json" },
    });
    location.reload();
  };

  const deleteTodo = async (id: number) => {
    await fetch("/api/todos", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    location.reload();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-800">TODO App!</h1>
      <div className="flex mt-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1 border p-2 rounded-l text-gray-800"
          placeholder="New todo..."
        />
        <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded-r">
          Add
        </button>
      </div>
      <ul className="mt-4">
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
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}