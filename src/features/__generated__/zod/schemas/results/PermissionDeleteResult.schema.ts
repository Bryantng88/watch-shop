import * as z from 'zod';
export const PermissionDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  code: z.string(),
  description: z.string().optional(),
  Role: z.array(z.unknown())
}));