import * as z from 'zod';
export const UserFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  email: z.string(),
  passwordHash: z.string().optional(),
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  roleId: z.string().optional(),
  customer: z.unknown().optional(),
  roles: z.array(z.unknown())
}));