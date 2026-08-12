import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptSelectObjectSchema as PurchaseRequestIngressReceiptSelectObjectSchema } from './objects/PurchaseRequestIngressReceiptSelect.schema';
import { PurchaseRequestIngressReceiptIncludeObjectSchema as PurchaseRequestIngressReceiptIncludeObjectSchema } from './objects/PurchaseRequestIngressReceiptInclude.schema';
import { PurchaseRequestIngressReceiptCreateInputObjectSchema as PurchaseRequestIngressReceiptCreateInputObjectSchema } from './objects/PurchaseRequestIngressReceiptCreateInput.schema';
import { PurchaseRequestIngressReceiptUncheckedCreateInputObjectSchema as PurchaseRequestIngressReceiptUncheckedCreateInputObjectSchema } from './objects/PurchaseRequestIngressReceiptUncheckedCreateInput.schema';

export const PurchaseRequestIngressReceiptCreateOneSchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateArgs> = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), data: z.union([PurchaseRequestIngressReceiptCreateInputObjectSchema, PurchaseRequestIngressReceiptUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptCreateArgs>;

export const PurchaseRequestIngressReceiptCreateOneZodSchema = z.object({ select: PurchaseRequestIngressReceiptSelectObjectSchema.optional(), include: PurchaseRequestIngressReceiptIncludeObjectSchema.optional(), data: z.union([PurchaseRequestIngressReceiptCreateInputObjectSchema, PurchaseRequestIngressReceiptUncheckedCreateInputObjectSchema]) }).strict();