import { randomUUID } from "node:crypto";
import { users } from "../consts.js";

export const mutation = {
  createUser: (
    _parent: unknown,
    args: { input: { name: string; email: string } },
  ) => {
    const user = { id: randomUUID(), ...args.input };
    users.push(user);
    return user;
  },
  updateUser: (
    _parent: unknown,
    args: { id: string; input: { name?: string; email?: string } },
  ) => {
    const user = users.find((u) => u.id === args.id);
    if (!user) return null;
    Object.assign(user, args.input);
    return user;
  },
  deleteUser: (_parent: unknown, args: { id: string }) => {
    const index = users.findIndex((u) => u.id === args.id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};
