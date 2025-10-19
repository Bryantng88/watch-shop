import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  totalCost: SortOrderSchema.optional(),
  revenueAmount: SortOrderSchema.optional()
}).strict();
export const MaintenanceRecordSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordSumOrderByAggregateInput>;
export const MaintenanceRecordSumOrderByAggregateInputObjectZodSchema = makeSchema();
