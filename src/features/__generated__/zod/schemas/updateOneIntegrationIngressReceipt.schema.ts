import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptSelectObjectSchema as IntegrationIngressReceiptSelectObjectSchema } from './objects/IntegrationIngressReceiptSelect.schema';
import { IntegrationIngressReceiptUpdateInputObjectSchema as IntegrationIngressReceiptUpdateInputObjectSchema } from './objects/IntegrationIngressReceiptUpdateInput.schema';
import { IntegrationIngressReceiptUncheckedUpdateInputObjectSchema as IntegrationIngressReceiptUncheckedUpdateInputObjectSchema } from './objects/IntegrationIngressReceiptUncheckedUpdateInput.schema';
import { IntegrationIngressReceiptWhereUniqueInputObjectSchema as IntegrationIngressReceiptWhereUniqueInputObjectSchema } from './objects/IntegrationIngressReceiptWhereUniqueInput.schema';

export const IntegrationIngressReceiptUpdateOneSchema: z.ZodType<Prisma.IntegrationIngressReceiptUpdateArgs> = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(),  data: z.union([IntegrationIngressReceiptUpdateInputObjectSchema, IntegrationIngressReceiptUncheckedUpdateInputObjectSchema]), where: IntegrationIngressReceiptWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptUpdateArgs>;

export const IntegrationIngressReceiptUpdateOneZodSchema = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(),  data: z.union([IntegrationIngressReceiptUpdateInputObjectSchema, IntegrationIngressReceiptUncheckedUpdateInputObjectSchema]), where: IntegrationIngressReceiptWhereUniqueInputObjectSchema }).strict();