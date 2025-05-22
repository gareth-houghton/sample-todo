import { db } from "@/drizzle/db";
import { todos } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allTodos = await db.select().from(todos)
    return NextResponse.json(allTodos);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    await db.insert(todos).values({ title, completed: false });
    return NextResponse.json({ message: "Todo added successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add todo" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, completed } = await req.json();
    await db.update(todos).set({ completed }).where(eq(todos.id, id));
    return NextResponse.json({ message: "Todo updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await db.delete(todos).where(eq(todos.id, id));
    return NextResponse.json({ message: "Todo successfully deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}