import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  totalCost: SortOrderSchema.optional(),
  revenueAmount: SortOrderSchema.optional(),
  paidAmount: SortOrderSchema.optional()
}).strict();
export const MaintenanceRecordAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordAvgOrderByAggregateInput>;
export const MaintenanceRecordAvgOrderByAggregateInputObjectZodSchema = makeSchema();
