import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemDecisionSchema } from '../enums/PurchaseRequestItemDecision.schema';
import { ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema as ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateNestedOneWithoutPurchaseRequestItemInput.schema'

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
  product: z.lazy(() => ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema)
}).strict();
export const PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateWithoutPurchaseRequestInput>;
export const PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
