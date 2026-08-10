import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestActivityTypeSchema } from '../enums/PurchaseRequestActivityType.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: PurchaseRequestActivityTypeSchema,
  note: z.string().optional().nullable(),
  actorUserId: z.string().optional().nullable(),
  followUpAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInput>;
export const PurchaseRequestActivityUncheckedCreateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
