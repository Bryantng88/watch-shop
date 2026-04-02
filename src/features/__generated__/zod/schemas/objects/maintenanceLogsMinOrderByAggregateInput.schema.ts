import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  technicalAssessmentId: SortOrderSchema.optional(),
  approvalRequestId: SortOrderSchema.optional(),
  sourceType: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  execution: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  partId: SortOrderSchema.optional(),
  cost: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  autoApproved: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const maintenanceLogsMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.maintenanceLogsMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsMinOrderByAggregateInput>;
export const maintenanceLogsMinOrderByAggregateInputObjectZodSchema = makeSchema();
