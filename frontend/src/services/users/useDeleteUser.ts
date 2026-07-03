import { useMutation, useQueryClient } from "@tanstack/react-query";

import { graphqlClient } from "@/graphql/client";

import { DeleteUserDocument } from "@/graphql/types";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      graphqlClient.request(DeleteUserDocument, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
