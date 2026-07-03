import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/graphql/client";
import { CreateUserDocument } from "@/graphql/types";
import type { CreateUserInput } from "@/graphql/schema-types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) =>
      graphqlClient.request(CreateUserDocument, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
