import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  listPriceSnapshot: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestItemSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemSumOrderByAggregateInput>;
export const PurchaseRequestItemSumOrderByAggregateInputObjectZodSchema = makeSchema();
