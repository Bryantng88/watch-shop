import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  cost: SortOrderSchema.optional()
}).strict();
export const maintenanceLogsAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.maintenanceLogsAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsAvgOrderByAggregateInput>;
export const maintenanceLogsAvgOrderByAggregateInputObjectZodSchema = makeSchema();
