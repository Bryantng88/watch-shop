import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptCreateManyInputObjectSchema as PurchaseRequestIngressReceiptCreateManyInputObjectSchema } from './objects/PurchaseRequestIngressReceiptCreateManyInput.schema';

export const PurchaseRequestIngressReceiptCreateManySchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyArgs> = z.object({ data: z.union([ PurchaseRequestIngressReceiptCreateManyInputObjectSchema, z.array(PurchaseRequestIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateManyArgs>;

export const PurchaseRequestIngressReceiptCreateManyZodSchema = z.object({ data: z.union([ PurchaseRequestIngressReceiptCreateManyInputObjectSchema, z.array(PurchaseRequestIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();