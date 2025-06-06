import { InferResolvers } from "garph";
import { YogaInitialContext } from "graphql-yoga";
import { eq } from "drizzle-orm";
import { queryType } from "./schema";
import { db } from "../drizzle/db";
import { todos } from "../drizzle/schema";

type Resolvers = InferResolvers<
  { Query: typeof queryType; },
  { context: YogaInitialContext }
>;

export const resolvers: Resolvers = {
  Query: {
    getTodos: (_, __, ctx) => {
      //return db.select().from(todos);
    },
  },
};