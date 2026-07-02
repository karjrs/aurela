import { users } from "../consts.js";

export const query = {
  user: (_parent: unknown, args: { id: string }) =>
    users.find((u) => u.id === args.id) ?? null,
  users: () => users,
};
