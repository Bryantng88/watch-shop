import * as z from 'zod';
export const RoleCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  Permission: z.array(z.unknown()),
  User: z.array(z.unknown())
});