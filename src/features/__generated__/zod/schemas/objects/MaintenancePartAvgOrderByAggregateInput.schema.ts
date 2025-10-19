import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  unitCost: SortOrderSchema.optional()
}).strict();
export const MaintenancePartAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MaintenancePartAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartAvgOrderByAggregateInput>;
export const MaintenancePartAvgOrderByAggregateInputObjectZodSchema = makeSchema();
