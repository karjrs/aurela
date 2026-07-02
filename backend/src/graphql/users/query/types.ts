export const types = /* GraphQL */ `
   extend type Query {
    user(id: ID!): User
    users: [User!]!
  }
  `;