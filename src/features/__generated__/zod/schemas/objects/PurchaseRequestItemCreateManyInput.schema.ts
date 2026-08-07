import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  purchaseRequestId: z.string(),
  productId: z.string(),
  titleSnapshot: z.string(),
  listPriceSnapshot: z.number(),
  quantity: z.number().int().optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const PurchaseRequestItemCreateManyInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemCreateManyInput>;
export const PurchaseRequestItemCreateManyInputObjectZodSchema = makeSchema();
