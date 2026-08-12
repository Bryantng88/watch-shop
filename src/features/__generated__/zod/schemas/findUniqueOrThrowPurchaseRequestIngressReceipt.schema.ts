import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptSelectObjectSchema as PurchaseRequestIngressReceiptSelectObjectSchema } from './objects/PurchaseRequestIngressReceiptSelect.schema';
import { PurchaseRequestIngressReceiptIncludeObjectSchema as PurchaseRequestIngressReceiptIncludeObjectSchema } from './objects/PurchaseRequestIngressReceiptInclude.schema';
import { PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema as PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereUniqueInput.schema';

export const PurchaseRequestIngressReceiptFindUniqueOrThrowSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptFindUniqueOrThrowArgs> = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), where: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptFindUniqueOrThrowArgs>;

export const PurchaseRequestIngressReceiptFindUniqueOrThrowZodSchema = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), where: PurchaseRequestIngressReceiptWhereUniqueInputObjectSchema }).strict();