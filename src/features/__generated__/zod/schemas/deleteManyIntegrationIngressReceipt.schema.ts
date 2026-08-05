import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptWhereInputObjectSchema as IntegrationIngressReceiptWhereInputObjectSchema } from './objects/IntegrationIngressReceiptWhereInput.schema';

export const IntegrationIngressReceiptDeleteManySchema: z.ZodType<Prisma.IntegrationIngressReceiptDeleteManyArgs> = z.object({ where: IntegrationIngressReceiptWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptDeleteManyArgs>;

export const IntegrationIngressReceiptDeleteManyZodSchema = z.object({ where: IntegrationIngressReceiptWhereInputObjectSchema.optional() }).strict();