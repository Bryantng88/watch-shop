import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  balanceAfter: SortOrderSchema.optional()
}).strict();
export const StrapInventoryMovementAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementAvgOrderByAggregateInput>;
export const StrapInventoryMovementAvgOrderByAggregateInputObjectZodSchema = makeSchema();
