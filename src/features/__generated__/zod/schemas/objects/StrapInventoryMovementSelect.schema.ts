import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  strapVariantId: z.boolean().optional(),
  movementType: z.boolean().optional(),
  quantity: z.boolean().optional(),
  balanceAfter: z.boolean().optional(),
  watchId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  sourceType: z.boolean().optional(),
  sourceId: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  strapVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const StrapInventoryMovementSelectObjectSchema: z.ZodType<Prisma.StrapInventoryMovementSelect> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementSelect>;
export const StrapInventoryMovementSelectObjectZodSchema = makeSchema();
