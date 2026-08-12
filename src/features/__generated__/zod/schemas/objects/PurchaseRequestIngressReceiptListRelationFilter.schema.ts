import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestIngressReceiptWhereInputObjectSchema as PurchaseRequestIngressReceiptWhereInputObjectSchema } from './PurchaseRequestIngressReceiptWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema).optional(),
  some: z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema).optional(),
  none: z.lazy(() => PurchaseRequestIngressReceiptWhereInputObjectSchema).optional()
}).strict();
export const PurchaseRequestIngressReceiptListRelationFilterObjectSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptListRelationFilter>;
export const PurchaseRequestIngressReceiptListRelationFilterObjectZodSchema = makeSchema();
