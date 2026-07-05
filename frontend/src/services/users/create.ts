import { graphqlClient } from "@graphql/client";
import type { CreateUserInput } from "@graphql/schema-types";
import { CreateUserDocument } from "@graphql/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
