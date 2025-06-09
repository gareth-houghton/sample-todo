import { InferResolvers } from "garph";
import { YogaInitialContext } from "graphql-yoga";
import { queryType } from "./schema";
import { GetAllTodosForUser } from "@/utils/db";

type Resolvers = InferResolvers<
  { Query: typeof queryType; },
  { context: YogaInitialContext }
>;

export const resolvers: Resolvers = {
  Query: {
    getTodos: async (parent, args, context, info) => {
      if (!args.userId || typeof args.userId !== 'string') {
        throw new Error('Invalid userId provided in gql');
      }
      
      try {
        return await GetAllTodosForUser(args.userId);
      } catch (error) {
        console.error('Failed to fetch todos in gql:', error);
        throw new Error('Failed to fetch todos gql');
      }
    },
  },
};