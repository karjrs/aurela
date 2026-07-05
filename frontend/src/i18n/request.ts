import { getRequestConfig } from "next-intl/server";

const NAMESPACES = ["actions", "errors", "users"] as const;

export default getRequestConfig(async () => {
  const locale = "en";

  const modules = await Promise.all(
    NAMESPACES.map((namespace) => import(`./${locale}/${namespace}.json`)),
  );
  const messages = Object.fromEntries(
    NAMESPACES.map((namespace, i) => [namespace, modules[i].default]),
  );

  return { locale, messages };
});
