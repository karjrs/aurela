import { NAMESPACES } from "./consts";

export const mergeMessages = async (locale: string) => {
  const modules = await Promise.all(
    NAMESPACES.map((namespace) => import(`./${locale}/${namespace}.json`)),
  );

  return Object.fromEntries(
    NAMESPACES.map((namespace, i) => [namespace, modules[i].default]),
  );
};
