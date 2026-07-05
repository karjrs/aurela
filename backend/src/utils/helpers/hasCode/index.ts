export const hasCode = (value: unknown): value is { code: unknown } =>
  typeof value === "object" && value !== null && "code" in value;
