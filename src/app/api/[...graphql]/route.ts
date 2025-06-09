import { schema } from "@/gql/schema";
import { createYoga } from "graphql-yoga";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST }