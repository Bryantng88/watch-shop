import * as z from 'zod';
export const PermissionFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().optional(),
  roles: z.array(z.unknown())
}));