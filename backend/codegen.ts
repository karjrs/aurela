import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "src/graphql/schema.ts",
  generates: {
    "src/graphql/types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    "schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
};

export default config;
