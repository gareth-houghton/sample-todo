import { schema } from "@/gql/schema";
import { createYoga } from "graphql-yoga";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export const GET = (req: Request) => handleRequest(req, {});
export const POST = (req: Request) => handleRequest(req, {});