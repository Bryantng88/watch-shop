import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  technicalAssessmentId: z.literal(true).optional(),
  approvalRequestId: z.literal(true).optional(),
  sourceType: z.literal(true).optional(),
  category: z.literal(true).optional(),
  action: z.literal(true).optional(),
  execution: z.literal(true).optional(),
  vendorId: z.literal(true).optional(),
  partId: z.literal(true).optional(),
  cost: z.literal(true).optional(),
  note: z.literal(true).optional(),
  status: z.literal(true).optional(),
  autoApproved: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const MaintenanceLogsMaxAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceLogsMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceLogsMaxAggregateInputType>;
export const MaintenanceLogsMaxAggregateInputObjectZodSchema = makeSchema();
