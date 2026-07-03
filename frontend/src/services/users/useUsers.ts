import { useQuery } from "@tanstack/react-query";

import { graphqlClient } from "@/graphql/client";

import { GetUsersDocument } from "@/graphql/types";

export const useUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: () => graphqlClient.request(GetUsersDocument),
  });
