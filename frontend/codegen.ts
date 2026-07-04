import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/schema.graphql",
  documents: "src/graphql/**/*.graphql",
  generates: {
    // Two output files, not one: combining `typescript-operations` with
    // `typescript` in the same file hits a v6 bug where it re-declares every
    // input/enum type referenced by an operation's variables, colliding with
    // `typescript`'s own declaration (TS2300: Duplicate identifier).
    "src/graphql/schema-types.ts": {
      plugins: ["typescript"],
    },
    "src/graphql/types.ts": {
      plugins: ["typescript-operations", "typed-document-node"],
      config: {
        importSchemaTypesFrom: "./src/graphql/schema-types",
      },
    },
  },
};

export default config;
