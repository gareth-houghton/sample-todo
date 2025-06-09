import { db } from "@/drizzle/db";
import { todos } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NewTodo, TodoRecord } from "./types";

export async function GetAllTodosForUser(userId: string): Promise<TodoRecord[]> {
  return db.select()
    .from(todos)
    .where(eq(todos.userId, userId))
}

export async function CreateTodo(todo: NewTodo) {
  return await 
    db.insert(todos)
    .values({ 
      title: todo.title, 
      completed: todo.completed, 
      createdAt: todo.createdAt, 
      userId: todo.userId 
    });
}

export async function ExistingTodo(todoId: number, userId: string): Promise<TodoRecord[]> {
  return db.select()
    .from(todos)
    .where(
      and(
        eq(todos.id, todoId),
        eq(todos.userId, userId)
      )
    )
    .limit(1);
}

export async function UpdateTodo(todoId: number, userId: string, completed: boolean) {
  return await 
    db.update(todos)
    .set({ completed })
    .where(
      and(
        eq(todos.id, todoId),
        eq(todos.userId, userId)
      )
    );
}

export async function DeleteTodo(todoId: number, userId: string) {
  return await
    db.delete(todos)
    .where(
      and(
        eq(todos.id, todoId),
        eq(todos.userId, userId)
      )
    );
}