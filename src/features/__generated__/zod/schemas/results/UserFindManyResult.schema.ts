import * as z from 'zod';
export const UserFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});