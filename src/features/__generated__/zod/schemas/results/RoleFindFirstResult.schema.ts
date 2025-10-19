import * as z from 'zod';
export const RoleFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  permissions: z.array(z.unknown()),
  users: z.array(z.unknown())
}));