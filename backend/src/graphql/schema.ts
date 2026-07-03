import { createSchema } from "graphql-yoga";

import users from "./users/index.js";

export const schema = createSchema({
  typeDefs: [`type Query type Mutation`, ...users.types],
  resolvers: {
    Query: { ...users.query },
    Mutation: { ...users.mutation },
  },
});
