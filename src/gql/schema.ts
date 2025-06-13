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
  todosByUserId: g.ref(() => TodoGQL).list()
    .args({
      userId: g.string().required()
    })
    .description("Gets all the todos for the provided user"),
});

/**
 * Creates a custom GraphQL scalar type for Date values with ISO string serialization.
 *
 * The generated scalar type serializes JavaScript Date objects to ISO 8601 strings and parses ISO strings back to Date objects.
 *
 * @param name - The name of the custom scalar type.
 * @returns A GraphQL scalar type for handling Date values as ISO strings.
 */
function createDateType(name: string) {
  return g.scalarType<Date, string>(name, {
    serialize: (value) => value.toISOString(),
    parseValue: (value) => new Date(value),
  });
}

export const schema = buildSchema({ g, resolvers });