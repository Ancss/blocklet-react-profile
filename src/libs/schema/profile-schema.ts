import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string(),
  did: z.string(),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  avatar: z.string().optional(),
  language: z.string(),
  theme: z.enum(['light', 'dark']),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;
