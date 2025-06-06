import { db } from "@/drizzle/db";
import { todos } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headersList = await headers();
    const user = headersList.get("userId");

    const allTodos = await db.select().from(todos).where(eq(todos.userId, user!))
    return NextResponse.json(allTodos);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    const headersList = await headers();
    const user = headersList.get("userId");

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if(!user || typeof user !== "string" || user.trim() === "") {
      return NextResponse.json({ error: "User is required" }, { status: 400 })
    }

    await db.insert(todos).values({ title: title, completed: false, createdAt: new Date(), userId: user! });
    return NextResponse.json({ message: "Todo added successfully" });
  } catch (error) {
    console.error("Failed to add todo:", error);
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}

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