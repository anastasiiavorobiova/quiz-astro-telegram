import { z } from "zod";

export const passwordRequirements = {
  hasNumber: /[0-9]/,
  hasLetter: /[a-z]/,
  hasUpperCaseLetter: /[A-Z]/,
  noSpecialCharacter: /^[^$&+,:;=?@#|'<>.^*(){}%!-]+$/,
};

export const passwordValidation = z
  .string()
  .min(8, "Password should be more than 8 letters")
  .regex(passwordRequirements.hasNumber, "Password should contain digits")
  .regex(
    passwordRequirements.hasLetter,
    "Password should contain lowercase letters",
  )
  .regex(
    passwordRequirements.hasUpperCaseLetter,
    "Password should contain uppercase letters",
  )
  .regex(
    passwordRequirements.noSpecialCharacter,
    "Password shouldn't contain parentheses, mathematical marks, punctuation marks",
  );

export const signUpSchema = z
  .object({
    email: z.string().email("Wrong email format"),
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password must match",
    path: ["confirmPassword"],
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;
