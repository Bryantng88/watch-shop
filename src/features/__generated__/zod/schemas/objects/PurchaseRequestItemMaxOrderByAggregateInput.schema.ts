import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  titleSnapshot: SortOrderSchema.optional(),
  listPriceSnapshot: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  decision: SortOrderSchema.optional(),
  agreedPrice: SortOrderSchema.optional(),
  decisionReason: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestItemMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemMaxOrderByAggregateInput>;
export const PurchaseRequestItemMaxOrderByAggregateInputObjectZodSchema = makeSchema();
