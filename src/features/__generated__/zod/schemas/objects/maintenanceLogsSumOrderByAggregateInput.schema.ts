import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  cost: SortOrderSchema.optional()
}).strict();
export const maintenanceLogsSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.maintenanceLogsSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsSumOrderByAggregateInput>;
export const maintenanceLogsSumOrderByAggregateInputObjectZodSchema = makeSchema();
