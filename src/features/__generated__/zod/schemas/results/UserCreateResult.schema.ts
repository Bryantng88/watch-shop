import * as z from 'zod';
export const UserCreateResultSchema = z.object({
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
  maintenanceRecord: z.array(z.unknown()),
  notification: z.array(z.unknown()),
  serviceRequest: z.array(z.unknown()),
  technicalIssue: z.array(z.unknown()),
  roles: z.array(z.unknown())
});