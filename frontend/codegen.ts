import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../backend/schema.graphql",
  documents: "src/graphql/**/*.graphql",
  generates: {
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
