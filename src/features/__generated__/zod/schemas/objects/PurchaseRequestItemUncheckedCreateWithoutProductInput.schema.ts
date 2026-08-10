import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  purchaseRequestId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  decision: PurchaseRequestItemDecisionSchema.optional(),
  agreedPrice: z.number().optional().nullable(),
  decisionReason: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateWithoutProductInput>;
export const PurchaseRequestItemUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
