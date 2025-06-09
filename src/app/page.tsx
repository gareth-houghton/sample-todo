"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle, PlusCircle, Trash2, AlertCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

/**
 * Displays the Todo application interface, enabling users to manage tasks within a selected user context.
 *
 * Provides functionality to view, add, complete, and delete todos, with real-time updates based on user actions and server responses. Supports switching between different users, automatically fetching and displaying tasks for the selected user. Handles loading and error states to ensure a responsive user experience.
 */
export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    /**
     * Fetches the list of todos for the currently selected user and updates the state.
     *
     * @remark
     * Sets loading and error states appropriately during the fetch operation.
     */
    async function fetchTodos() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/todos", {
          headers: { "userId": user },
        });

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
  }, [user]);

  const addTodo = async () => {
    if(!newTodo) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: newTodo }),
        headers: { 
          "Content-Type": "application/json",
          "userId": user,
        },
      });
      
      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const todosRes = await fetch("/api/todos", {
        headers: { "userId": user },
      });
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
        body: JSON.stringify({ id, completed: !completed, userId: user }),
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
        body: JSON.stringify({ id: id, userId: user }),
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

  const handleUserContextChange = (newUser: string) => {
    setUser(newUser);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <Select onValueChange={handleUserContextChange}>
        <SelectTrigger className="w-2/3 mx-auto mb-5">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user1">User #1</SelectItem>
          <SelectItem value="user2">User #2</SelectItem>
        </SelectContent>
      </Select>
      <Card className="shadow-lg border-opacity-50">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              My Tasks
            </CardTitle>
            <ThemeToggle />
          </div>
        </CardHeader>
        
        {error && (
          <div className="px-6 pt-4">
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-5 duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setError(null)}
                  className="h-6 w-6 p-0 rounded-full"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        <CardContent className="pt-6">
          <form 
            className="flex space-x-2"
            onSubmit={(e) => {
              e.preventDefault();
              addTodo();
            }}
          >
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1"
            />
            <Button type="submit" className="shrink-0">
              <PlusCircle className="mr-1 h-4 w-4" />
              Add
            </Button>
          </form>
          
          <div className="mt-6 space-y-1">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground animate-pulse">
                Loading tasks...
              </div>
            ) : todos.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No tasks yet. Add one above!
              </div>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-center justify-between p-3 rounded-md transition-all duration-200 ${
                      todo.completed 
                        ? "bg-muted/50" 
                        : "bg-card hover:bg-accent/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                        id={`todo-${todo.id}`}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className={`text-sm cursor-pointer ${
                          todo.completed 
                            ? "text-muted-foreground line-through" 
                            : "text-foreground"
                        }`}
                      >
                        {todo.title}
                      </label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4 text-xs text-muted-foreground">
          <div>
            {todos.length} {todos.length === 1 ? "task" : "tasks"}
          </div>
          <div>
            {todos.filter(t => t.completed).length} completed
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}