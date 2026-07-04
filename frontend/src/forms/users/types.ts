import type { z } from "zod";

import type { schema } from "./schema";

export type UserFormValues = z.infer<typeof schema>;
