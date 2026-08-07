import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInputObjectSchema as PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInputObjectSchema } from './PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  purchaseRequestId_productId: z.lazy(() => PurchaseRequestItemPurchaseRequestIdProductIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const PurchaseRequestItemWhereUniqueInputObjectSchema: z.ZodType<Prisma.PurchaseRequestItemWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestItemWhereUniqueInput>;
export const PurchaseRequestItemWhereUniqueInputObjectZodSchema = makeSchema();
