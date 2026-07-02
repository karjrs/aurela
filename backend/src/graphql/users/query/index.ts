import type { QueryResolvers } from "../../types.js";
import { users } from "../consts.js";

export const query: QueryResolvers = {
  user: (_parent, args) => users.find((u) => u.id === args.id) ?? null,
  users: () => users,
};
