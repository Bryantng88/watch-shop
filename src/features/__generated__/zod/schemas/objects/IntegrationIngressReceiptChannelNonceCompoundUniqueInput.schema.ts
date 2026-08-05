import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  channel: z.string(),
  nonce: z.string()
}).strict();
export const IntegrationIngressReceiptChannelNonceCompoundUniqueInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptChannelNonceCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptChannelNonceCompoundUniqueInput>;
export const IntegrationIngressReceiptChannelNonceCompoundUniqueInputObjectZodSchema = makeSchema();
