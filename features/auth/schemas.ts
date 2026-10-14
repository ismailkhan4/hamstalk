import { z } from "zod"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function passwordRules(password: string) {
  return {
    length: password.length >= 8,
    letterAndNumber: /[A-Za-zÄÖÜäöüß]/.test(password) && /[0-9]/.test(password),
  }
}

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .regex(EMAIL_PATTERN, "Enter an email like name@example.com.")

const newPassword = z.string().refine((value) => {
  const rules = passwordRules(value)
  return rules.length && rules.letterAndNumber
}, "Use at least 8 characters, with at least one letter and one number.")

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Enter your name so your teammates know what to call you.")
    .max(80, "Use 80 characters or fewer."),
  email,
  password: newPassword,
})

export const profileSchema = z.object({
  fullName: signUpSchema.shape.fullName,
  email,
})

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
})

export const forgotPasswordSchema = z.object({ email })

export const resendSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, "Type your new password again."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords don’t match. Check both fields for typos.",
  })

export type SignUpValues = z.infer<typeof signUpSchema>
export type ProfileValues = z.infer<typeof profileSchema>
export type SignInValues = z.infer<typeof signInSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
