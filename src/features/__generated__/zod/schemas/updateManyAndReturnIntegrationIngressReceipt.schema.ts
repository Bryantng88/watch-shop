import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptSelectObjectSchema as IntegrationIngressReceiptSelectObjectSchema } from './objects/IntegrationIngressReceiptSelect.schema';
import { IntegrationIngressReceiptUpdateManyMutationInputObjectSchema as IntegrationIngressReceiptUpdateManyMutationInputObjectSchema } from './objects/IntegrationIngressReceiptUpdateManyMutationInput.schema';
import { IntegrationIngressReceiptWhereInputObjectSchema as IntegrationIngressReceiptWhereInputObjectSchema } from './objects/IntegrationIngressReceiptWhereInput.schema';

export const IntegrationIngressReceiptUpdateManyAndReturnSchema: z.ZodType<Prisma.IntegrationIngressReceiptUpdateManyAndReturnArgs> = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(), data: IntegrationIngressReceiptUpdateManyMutationInputObjectSchema, where: IntegrationIngressReceiptWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptUpdateManyAndReturnArgs>;

export const IntegrationIngressReceiptUpdateManyAndReturnZodSchema = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(), data: IntegrationIngressReceiptUpdateManyMutationInputObjectSchema, where: IntegrationIngressReceiptWhereInputObjectSchema.optional() }).strict();