import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/graphql/client";
import { UpdateUserDocument } from "@/graphql/types";
import type { UpdateUserInput } from "@/graphql/schema-types";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      graphqlClient.request(UpdateUserDocument, { id, input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
