export const PASSWORD_POLICY = {
  MIN: 8,
  MAX: 64,
} as const;

export const passwordSchema = (z: typeof import('zod').z) =>
  z
    .string()
    .min(
      PASSWORD_POLICY.MIN,
      `Password must be at least ${PASSWORD_POLICY.MIN} characters long`
    )
    .max(
      PASSWORD_POLICY.MAX,
      `Password must be at most ${PASSWORD_POLICY.MAX} characters long`
    );
