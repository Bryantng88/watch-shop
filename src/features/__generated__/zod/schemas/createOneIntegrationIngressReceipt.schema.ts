import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { IntegrationIngressReceiptSelectObjectSchema as IntegrationIngressReceiptSelectObjectSchema } from './objects/IntegrationIngressReceiptSelect.schema';
import { IntegrationIngressReceiptCreateInputObjectSchema as IntegrationIngressReceiptCreateInputObjectSchema } from './objects/IntegrationIngressReceiptCreateInput.schema';
import { IntegrationIngressReceiptUncheckedCreateInputObjectSchema as IntegrationIngressReceiptUncheckedCreateInputObjectSchema } from './objects/IntegrationIngressReceiptUncheckedCreateInput.schema';

export const IntegrationIngressReceiptCreateOneSchema: z.ZodType<Prisma.IntegrationIngressReceiptCreateArgs> = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(),  data: z.union([IntegrationIngressReceiptCreateInputObjectSchema, IntegrationIngressReceiptUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptCreateArgs>;

export const IntegrationIngressReceiptCreateOneZodSchema = z.object({ select: IntegrationIngressReceiptSelectObjectSchema.optional(),  data: z.union([IntegrationIngressReceiptCreateInputObjectSchema, IntegrationIngressReceiptUncheckedCreateInputObjectSchema]) }).strict();