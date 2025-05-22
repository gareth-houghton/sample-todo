import { db } from "@/drizzle/db";
import { todos } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Retrieves all todo items from the database and returns them as a JSON response.
 *
 * @returns A JSON response containing the list of all todos, or an error message with a 500 status code if retrieval fails.
 */
export async function GET() {
  try {
    const allTodos = await db.select().from(todos)
    return NextResponse.json(allTodos);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

/**
 * Handles HTTP POST requests to create a new todo item.
 *
 * Expects a JSON body with a non-empty "title" string. Returns a success message on successful creation, or an error message with appropriate status code if validation fails or an error occurs.
 */
export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await db.insert(todos).values({ title, completed: false });
    return NextResponse.json({ message: "Todo added successfully" });
  } catch (error) {
    console.error("Failed to add todo:", error);
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}

/**
 * Updates the completion status of a specific todo item.
 *
 * Expects a JSON request body containing an {@link id} and a boolean {@link completed} status. Returns a success message if the update is successful, or an error message with an appropriate status code if validation fails, the todo does not exist, or an internal error occurs.
 */
export async function PUT(req: Request) {
  try {
    const { id, completed } = await req.json();

    if (id === undefined || typeof completed !== "boolean") {
      return NextResponse.json({ error: "Valid id and completed status are required" }, { status: 400 });
    }

    const existingTodo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
    if (existingTodo.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await db.update(todos).set({ completed }).where(eq(todos.id, id));
    return NextResponse.json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Failed to update todo:", error);
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

/**
 * Handles HTTP DELETE requests to remove a todo item by its ID.
 *
 * Expects a JSON request body containing an {@link id}. Returns a success message if the todo is deleted, or an error message with an appropriate status code if the ID is missing, the todo does not exist, or a server error occurs.
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (id === undefined) {
      return NextResponse.json({ error: "Valid id is required" }, { status: 400 });
    }

    const existingTodo = await db.select().from(todos).where(eq(todos.id, id)).limit(1);
    if (existingTodo.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await db.delete(todos).where(eq(todos.id, id));
    return NextResponse.json({ message: "Todo successfully deleted" });
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}