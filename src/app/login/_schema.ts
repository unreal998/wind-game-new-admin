import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'errors.email-required' })
    .email({ message: "errors.invalid-email" })
    .trim(),
  password: z
    .string()
    .min(1, { message: 'errors.password-required' }),
})
export type LoginSchema = z.infer<typeof loginSchema>
