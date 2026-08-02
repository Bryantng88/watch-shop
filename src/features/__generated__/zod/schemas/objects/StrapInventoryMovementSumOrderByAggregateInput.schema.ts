import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  balanceAfter: SortOrderSchema.optional()
}).strict();
export const StrapInventoryMovementSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementSumOrderByAggregateInput>;
export const StrapInventoryMovementSumOrderByAggregateInputObjectZodSchema = makeSchema();
