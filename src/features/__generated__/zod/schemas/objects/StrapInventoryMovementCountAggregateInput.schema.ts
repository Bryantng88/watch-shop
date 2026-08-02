import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  strapVariantId: z.literal(true).optional(),
  movementType: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  balanceAfter: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  actorUserId: z.literal(true).optional(),
  sourceType: z.literal(true).optional(),
  sourceId: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const StrapInventoryMovementCountAggregateInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementCountAggregateInputType>;
export const StrapInventoryMovementCountAggregateInputObjectZodSchema = makeSchema();
