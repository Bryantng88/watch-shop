import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptSelectObjectSchema as IntegrationIngressReceiptSelectObjectSchema } from './objects/IntegrationIngressReceiptSelect.schema';
import { IntegrationIngressReceiptWhereUniqueInputObjectSchema as IntegrationIngressReceiptWhereUniqueInputObjectSchema } from './objects/IntegrationIngressReceiptWhereUniqueInput.schema';

export const IntegrationIngressReceiptDeleteOneSchema: z.ZodType<Prisma.IntegrationIngressReceiptDeleteArgs> = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(),  where: IntegrationIngressReceiptWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptDeleteArgs>;

export const IntegrationIngressReceiptDeleteOneZodSchema = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(),  where: IntegrationIngressReceiptWhereUniqueInputObjectSchema }).strict();