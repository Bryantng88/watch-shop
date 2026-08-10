import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema';
import { PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema as PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema } from './PurchaseRequestCreateNestedOneWithoutItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  decision: PurchaseRequestItemDecisionSchema.optional(),
  agreedPrice: z.number().optional().nullable(),
  decisionReason: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema)
}).strict();
export const PurchaseRequestItemCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateWithoutProductInput>;
export const PurchaseRequestItemCreateWithoutProductInputObjectZodSchema = makeSchema();
