import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  unitCost: SortOrderSchema.optional()
}).strict();
export const MaintenancePartSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MaintenancePartSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartSumOrderByAggregateInput>;
export const MaintenancePartSumOrderByAggregateInputObjectZodSchema = makeSchema();
