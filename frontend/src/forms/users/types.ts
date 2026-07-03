import { z } from "zod";

import { schema } from "./schema";

export type UserFormValues = z.infer<typeof schema>;
