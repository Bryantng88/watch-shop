import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptSelectObjectSchema as IntegrationIngressReceiptSelectObjectSchema } from './objects/IntegrationIngressReceiptSelect.schema';
import { IntegrationIngressReceiptCreateManyInputObjectSchema as IntegrationIngressReceiptCreateManyInputObjectSchema } from './objects/IntegrationIngressReceiptCreateManyInput.schema';

export const IntegrationIngressReceiptCreateManyAndReturnSchema: z.ZodType<Prisma.IntegrationIngressReceiptCreateManyAndReturnArgs> = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(), data: z.union([ IntegrationIngressReceiptCreateManyInputObjectSchema, z.array(IntegrationIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptCreateManyAndReturnArgs>;

export const IntegrationIngressReceiptCreateManyAndReturnZodSchema = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(), data: z.union([ IntegrationIngressReceiptCreateManyInputObjectSchema, z.array(IntegrationIngressReceiptCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();