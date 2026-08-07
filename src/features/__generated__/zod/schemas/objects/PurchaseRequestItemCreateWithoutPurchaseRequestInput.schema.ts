import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema as ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateNestedOneWithoutPurchaseRequestItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema)
}).strict();
export const PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateWithoutPurchaseRequestInput>;
export const PurchaseRequestItemCreateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
