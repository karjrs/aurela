import { ClientError } from "graphql-request";

export const getFieldErrors = (
  error: unknown,
): Record<string, string[]> | undefined => {
  if (!(error instanceof ClientError)) return undefined;

  return error.response.errors?.[0]?.extensions?.fieldErrors as
    | Record<string, string[]>
    | undefined;
};
