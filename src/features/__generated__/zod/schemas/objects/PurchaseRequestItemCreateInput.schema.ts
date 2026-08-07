import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema as PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema } from './PurchaseRequestCreateNestedOneWithoutItemsInput.schema';
import { ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema as ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema } from './ProductCreateNestedOneWithoutPurchaseRequestItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  purchaseRequest: z.lazy(() => PurchaseRequestCreateNestedOneWithoutItemsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutPurchaseRequestItemInputObjectSchema)
}).strict();
export const PurchaseRequestItemCreateInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateInput>;
export const PurchaseRequestItemCreateInputObjectZodSchema = makeSchema();
