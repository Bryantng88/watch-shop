import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapInventoryMovementTypeSchema } from '../enums/StrapInventoryMovementType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
export const StrapInventoryMovementCreateManyStrapVariantInputObjectSchema: z.ZodType<Prisma.StrapInventoryMovementCreateManyStrapVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapInventoryMovementCreateManyStrapVariantInput>;
export const StrapInventoryMovementCreateManyStrapVariantInputObjectZodSchema = makeSchema();
