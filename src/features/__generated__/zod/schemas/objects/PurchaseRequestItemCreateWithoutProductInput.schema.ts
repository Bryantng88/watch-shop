import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema as PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema } from './PurchaseRequestCreateNestedOneWithoutItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema)
}).strict();
export const PurchaseRequestItemCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateWithoutProductInput>;
export const PurchaseRequestItemCreateWithoutProductInputObjectZodSchema = makeSchema();
