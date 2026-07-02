import { randomUUID } from "node:crypto";
import type { MutationResolvers } from "../../types.js";
import { users } from "../consts.js";

export const mutation: MutationResolvers = {
  createUser: (_parent, args) => {
    const user = { id: randomUUID(), ...args.input };
    users.push(user);
    return user;
  },
  updateUser: (_parent, args) => {
    const user = users.find((u) => u.id === args.id);
    if (!user) return null;
    Object.assign(user, args.input);
    return user;
  },
  deleteUser: (_parent, args) => {
    const index = users.findIndex((u) => u.id === args.id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};
