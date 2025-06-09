import { GarphSchema, buildSchema } from "garph";
import { resolvers } from "./resolvers";

export const g = new GarphSchema();

export const TodoGQL = g.type("Todo", {
  id: g.int(),
  title: g.string(),
  completed: g.boolean(),
  createdAt: createDateType("createdAt"),
  lastUpdated: createDateType("lastUpdated"),
  userId: g.string()
});

export const queryType = g.type("Query", {
  getTodos: g.ref(() => TodoGQL).list()
    .args({
      userId: g.string().required()
    })
    .description("Gets all the todos"),
});

function createDateType(name: string) {
  return g.scalarType<Date, number>(name, {
    serialize: (value) => value.getTime(),
    parseValue: (value) => new Date(value),
  });
}

export const schema = buildSchema({ g, resolvers });