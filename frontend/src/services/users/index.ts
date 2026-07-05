import { graphqlClient } from "@graphql/client";
import { GetUsersDocument } from "@graphql/types";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => graphqlClient.request(GetUsersDocument),
  });
