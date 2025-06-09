import { db } from "@/drizzle/db";
import { todos } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";
import { NewTodo, TodoRecord } from "./types";

/**
 * Retrieves all todo records associated with the specified user ID.
 *
 * @param userId - The unique identifier of the user whose todos are to be fetched.
 * @returns An array of todo records belonging to the user.
 */
export async function GetAllTodosForUser(userId: string): Promise<TodoRecord[]> {
  return db.select()
    .from(todos)
    .where(eq(todos.userId, userId))
}

/**
 * Inserts a new todo record into the database.
 *
 * @param todo - The todo item to create, including title, completed status, creation timestamp, and user ID.
 * @returns The result of the insert operation.
 */
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

/**
 * Retrieves a todo record matching the specified todo ID and user ID.
 *
 * @param todoId - The unique identifier of the todo item.
 * @param userId - The unique identifier of the user.
 * @returns An array containing at most one todo record that matches both {@link todoId} and {@link userId}.
 */
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

/**
 * Updates the completion status of a todo item for a specific user.
 *
 * @param todoId - The unique identifier of the todo item to update.
 * @param userId - The user ID associated with the todo item.
 * @param completed - The new completion status to set.
 * @returns The result of the update operation.
 */
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

/**
 * Deletes a todo item identified by its ID and associated user ID.
 *
 * @param todoId - The unique identifier of the todo item to delete.
 * @param userId - The user ID to which the todo item belongs.
 */
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