import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestIngressReceiptWhereInputObjectSchema as PurchaseRequestIngressReceiptWhereInputObjectSchema } from './objects/PurchaseRequestIngressReceiptWhereInput.schema';

export const PurchaseRequestIngressReceiptDeleteManySchema: z.ZodType<Prisma.PurchaseRequestIngressReceiptDeleteManyArgs> = z.object({ where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestIngressReceiptDeleteManyArgs>;

export const PurchaseRequestIngressReceiptDeleteManyZodSchema = z.object({ where: PurchaseRequestIngressReceiptWhereInputObjectSchema.optional() }).strict();