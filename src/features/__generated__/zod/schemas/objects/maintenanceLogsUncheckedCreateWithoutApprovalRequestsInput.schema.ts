import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  serviceRequestId: z.string(),
  technicalAssessmentId: z.string().optional().nullable(),
  sourceType: z.string(),
  category: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
  execution: z.string().optional().nullable(),
  vendorId: z.string().optional().nullable(),
  partId: z.string().optional().nullable(),
  cost: z.number().int().optional(),
  note: z.string().optional().nullable(),
  status: z.string().optional(),
  autoApproved: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectSchema: z.ZodType<Prisma.maintenanceLogsUncheckedCreateWithoutApprovalRequestsInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsUncheckedCreateWithoutApprovalRequestsInput>;
export const maintenanceLogsUncheckedCreateWithoutApprovalRequestsInputObjectZodSchema = makeSchema();
