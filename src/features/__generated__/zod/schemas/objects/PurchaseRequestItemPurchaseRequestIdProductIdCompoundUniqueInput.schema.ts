import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  purchaseRequestId: z.string(),
  productId: z.string()
}).strict();
export const PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInput>;
export const PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInputObjectZodSchema = makeSchema();
