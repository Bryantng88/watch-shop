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
  Customer: z.unknown().optional(),
  MaintenanceRecord: z.array(z.unknown()),
  Notification: z.array(z.unknown()),
  ServiceRequest: z.array(z.unknown()),
  TechnicalIssue: z.array(z.unknown()),
  Role: z.array(z.unknown())
}));