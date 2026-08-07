import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  purchaseRequestId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestItemUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemUncheckedCreateWithoutProductInput>;
export const PurchaseRequestItemUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
