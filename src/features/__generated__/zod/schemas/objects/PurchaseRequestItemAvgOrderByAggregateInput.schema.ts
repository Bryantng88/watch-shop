import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  listPriceSnapshot: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  agreedPrice: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestItemAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemAvgOrderByAggregateInput>;
export const PurchaseRequestItemAvgOrderByAggregateInputObjectZodSchema = makeSchema();
