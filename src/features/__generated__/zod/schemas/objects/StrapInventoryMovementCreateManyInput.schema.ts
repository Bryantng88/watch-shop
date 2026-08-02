import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  strapVariantId: z.string(),
  movementType: StrapInventoryMovementTypeSchema,
  quantity: z.number().int(),
  balanceAfter: z.number().int().optional().nullable(),
  watchId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  actorUserId: z.string().optional().nullable(),
  sourceType: z.string().optional().nullable(),
  sourceId: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const StrapInventoryMovementCreateManyInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementCreateManyInput>;
export const StrapInventoryMovementCreateManyInputObjectZodSchema = makeSchema();
