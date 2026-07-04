import { createSchema } from "graphql-yoga";

import users from "./users/index.js";

export const schema = createSchema({
  // The bare `type Query type Mutation` anchor is required: resource modules
  // only ever `extend type Query`/`extend type Mutation`, never declare the
  // base type themselves, so without this anchor those extends would have
  // nothing to extend and the SDL would be invalid.
  typeDefs: [`type Query type Mutation`, ...users.types],
  resolvers: {
    // Spread at the field level (not `...users.query` as a whole resolver
    // object swap) so a future second resource's fields merge in rather than
    // silently overwriting this one's.
    Query: { ...users.query },
    Mutation: { ...users.mutation },
  },
});
