import { getRequestConfig } from "next-intl/server";
import { mergeMessages } from "./helpers";

export default getRequestConfig(async () => {
  const locale = "en";
  const messages = await mergeMessages(locale);

  return { locale, messages };
});
