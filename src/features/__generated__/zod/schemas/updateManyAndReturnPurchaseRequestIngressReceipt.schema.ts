import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptSelectObjectSchema as PurchaseRequestIngressReceiptSelectObjectSchema } from './objects/PurchaseRequestIngressReceiptSelect.schema';
import { PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema as PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema } from './objects/PurchaseRequestIngressReceiptUpdateManyMutationInput.schema';
import { PurchaseRequestIngressReceiptWhereInputObjectSchema as PurchaseRequestIngressReceiptWhereInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereInput.schema';

export const PurchaseRequestIngressReceiptUpdateManyAndReturnSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyAndReturnArgs> = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), data: PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema, where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateManyAndReturnArgs>;

export const PurchaseRequestIngressReceiptUpdateManyAndReturnZodSchema = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), data: PurchaseRequestIngressReceiptUpdateManyMutationInputObjectSchema, where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional() }).strict();