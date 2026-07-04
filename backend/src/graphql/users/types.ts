import { types as mutationTypes } from "./mutation/types.js";
import { types as queryTypes } from "./query/types.js";

const types = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input UpdateUserInput {
    name: String
    email: String
  }
`;

export default [types, queryTypes, mutationTypes];
