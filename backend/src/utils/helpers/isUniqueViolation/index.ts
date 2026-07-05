import { hasCode } from "../hasCode/index.js";

export const isUniqueViolation = (error: unknown) => {
  const cause = error instanceof Error ? error.cause : undefined;
  return (
    (hasCode(error) && error.code === "23505") ||
    (hasCode(cause) && cause.code === "23505")
  );
};
