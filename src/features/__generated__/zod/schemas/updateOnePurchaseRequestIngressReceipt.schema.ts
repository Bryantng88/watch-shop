import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptSelectObjectSchema as PurchaseRequestIngressReceiptSelectObjectSchema } from './objects/PurchaseRequestIngressReceiptSelect.schema';
import { PurchaseRequestIngressReceiptIncludeObjectSchema as PurchaseRequestIngressReceiptIncludeObjectSchema } from './objects/PurchaseRequestIngressReceiptInclude.schema';
import { PurchaseRequestIngressReceiptUpdateInputObjectSchema as PurchaseRequestIngressReceiptUpdateInputObjectSchema } from './objects/PurchaseRequestIngressReceiptUpdateInput.schema';
import { PurchaseRequestIngressReceiptUncheckedUpdateInputObjectSchema as PurchaseRequestIngressReceiptUncheckedUpdateInputObjectSchema } from './objects/PurchaseRequestIngressReceiptUncheckedUpdateInput.schema';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereUniqueInput.schema';

export const PurchaseRequestIngressReceiptUpdateOneSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateArgs> = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), data: z.union([PurchaseRequestIngressReceiptUpdateInputObjectSchema, PurchaseRequestIngressReceiptUncheckedUpdateInputObjectSchema]), where: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptUpdateArgs>;

export const PurchaseRequestIngressReceiptUpdateOneZodSchema = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), data: z.union([PurchaseRequestIngressReceiptUpdateInputObjectSchema, PurchaseRequestIngressReceiptUncheckedUpdateInputObjectSchema]), where: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema }).strict();