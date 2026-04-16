import * as z from 'zod';
export const VendorFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  role: z.unknown(),
  isAuthorized: z.boolean(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  note: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bankName: z.string().optional(),
  bankAcc: z.string().optional(),
  isActive: z.boolean(),
  Acquisition: z.array(z.unknown()),
  Invoice: z.array(z.unknown()),
  MaintenanceRecord: z.array(z.unknown()),
  product: z.array(z.unknown()),
  serviceRequest: z.array(z.unknown()),
  technicalAssessment: z.array(z.unknown()),
  technicalIssue: z.array(z.unknown()),
  bank: z.unknown().optional()
}));