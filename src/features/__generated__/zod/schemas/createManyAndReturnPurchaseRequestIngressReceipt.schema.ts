import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptSelectObjectSchema as PurchaseRequestIngressReceiptSelectObjectSchema } from './objects/PurchaseRequestIngressReceiptSelect.schema';
import { PurchaseRequestIngressReceiptCreateManyInputObjectSchema as PurchaseRequestIngressReceiptCreateManyInputObjectSchema } from './objects/PurchaseRequestIngressReceiptCreateManyInput.schema';

export const PurchaseRequestIngressReceiptCreateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyAndReturnArgs> = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), data: z.union([ PurchaseRequestIngressReceiptCreateManyInputObjectSchema, z.array(PurchaseRequestIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyAndReturnArgs>;

export const PurchaseRequestIngressReceiptCreateManyAndReturnZodSchema = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), data: z.union([ PurchaseRequestIngressReceiptCreateManyInputObjectSchema, z.array(PurchaseRequestIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();