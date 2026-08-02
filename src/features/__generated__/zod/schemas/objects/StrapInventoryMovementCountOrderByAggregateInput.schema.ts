import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  strapVariantId: SortOrderSchema.optional(),
  movementType: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  balanceAfter: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  sourceType: SortOrderSchema.optional(),
  sourceId: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const StrapInventoryMovementCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementCountOrderByAggregateInput>;
export const StrapInventoryMovementCountOrderByAggregateInputObjectZodSchema = makeSchema();
