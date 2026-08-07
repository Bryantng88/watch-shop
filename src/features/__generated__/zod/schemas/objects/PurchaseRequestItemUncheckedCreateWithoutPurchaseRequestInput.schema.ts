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
export const PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInput>;
export const PurchaseRequestItemUncheckedCreateWithoutPurchaseRequestInputObjectZodSchema = makeSchema();
