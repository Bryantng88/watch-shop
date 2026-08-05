import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptCreateManyInputObjectSchema as IntegrationIngressReceiptCreateManyInputObjectSchema } from './objects/IntegrationIngressReceiptCreateManyInput.schema';

export const IntegrationIngressReceiptCreateManySchema: z.ZodType<Prisma.IntegrationIngressReceiptCreateManyArgs> = z.object({ data: z.union([ IntegrationIngressReceiptCreateManyInputObjectSchema, z.array(IntegrationIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptCreateManyArgs>;

export const IntegrationIngressReceiptCreateManyZodSchema = z.object({ data: z.union([ IntegrationIngressReceiptCreateManyInputObjectSchema, z.array(IntegrationIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();