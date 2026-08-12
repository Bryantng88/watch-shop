import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptSelectObjectSchema as PurchaseRequestIngressReceiptSelectObjectSchema } from './objects/PurchaseRequestIngressReceiptSelect.schema';
import { PurchaseRequestIngressReceiptIncludeObjectSchema as PurchaseRequestIngressReceiptIncludeObjectSchema } from './objects/PurchaseRequestIngressReceiptInclude.schema';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereUniqueInput.schema';

export const PurchaseRequestIngressReceiptFindUniqueSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptFindUniqueArgs> = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), where: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptFindUniqueArgs>;

export const PurchaseRequestIngressReceiptFindUniqueZodSchema = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), where: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema }).strict();