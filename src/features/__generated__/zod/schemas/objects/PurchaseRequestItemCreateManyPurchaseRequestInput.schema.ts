import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  productId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestItemCreateManyPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateManyPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateManyPurchaseRequestInput>;
export const PurchaseRequestItemCreateManyPurchaseRequestInputObjectZodSchema = makeSchema();
