import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  purchaseRequestId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  followUpAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const PurchaseRequestActivityMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityMaxOrderByAggregateInput>;
export const PurchaseRequestActivityMaxOrderByAggregateInputObjectZodSchema = makeSchema();
