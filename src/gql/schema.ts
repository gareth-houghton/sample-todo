import { GarphSchema } from "garph";

export const g = new GarphSchema();

export const TodoGQL = g.type("Todo", {
  id: g.int(),
  title: g.string(),
  completed: g.boolean(),
  createdAt: g.string(),
  lastUpdated: g.string(),
  userId: g.string()
});

export const queryType = g.type("Query", {
  getTodos: g.ref(TodoGQL).list().description("Gets all the todos"),
});

