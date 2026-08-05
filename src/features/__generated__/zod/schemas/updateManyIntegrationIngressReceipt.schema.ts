import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptUpdateManyMutationInputObjectSchema as IntegrationIngressReceiptUpdateManyMutationInputObjectSchema } from './objects/IntegrationIngressReceiptUpdateManyMutationInput.schema';
import { IntegrationIngressReceiptWhereInputObjectSchema as IntegrationIngressReceiptWhereInputObjectSchema } from './objects/IntegrationIngressReceiptWhereInput.schema';

export const IntegrationIngressReceiptUpdateManySchema: z.ZodType<Prisma.IntegrationIngressReceiptUpdateManyArgs> = z.object({ data: IntegrationIngressReceiptUpdateManyMutationInputObjectSchema, where: IntegrationIngressReceiptWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptUpdateManyArgs>;

export const IntegrationIngressReceiptUpdateManyZodSchema = z.object({ data: IntegrationIngressReceiptUpdateManyMutationInputObjectSchema, where: IntegrationIngressReceiptWhereInputObjectSchema.optional() }).strict();