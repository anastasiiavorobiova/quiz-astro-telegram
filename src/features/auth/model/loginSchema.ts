import { z } from "zod";

import { passwordValidation } from "./signupSchema";

export const loginSchema = z.object({
  email: z.string().email("Wrong email format"),
  password: passwordValidation,
});

export type TLoginSchema = z.infer<typeof loginSchema>;
