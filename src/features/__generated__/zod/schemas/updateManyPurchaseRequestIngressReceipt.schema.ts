import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema as PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestIngressReceiptUpdateManyMutationInput.schema';
import { PurchaseRequestIngressReceiptWhereInputObjectSchema as PurchaseRequestIngressReceiptWhereInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereInput.schema';

export const PurchaseRequestIngressReceiptUpdateManySchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyArgs> = z.object({ data: PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema, where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyArgs>;

export const PurchaseRequestIngressReceiptUpdateManyZodSchema = z.object({ data: PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema, where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional() }).strict();