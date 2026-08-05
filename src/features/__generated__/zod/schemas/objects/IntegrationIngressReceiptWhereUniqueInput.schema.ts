import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { IntegrationIngressReceiptChannelNonceCompoundUniqueInputObjectSchema as IntegrationIngressReceiptChannelNonceCompoundUniqueInputObjectSchema } from './IntegrationIngressReceiptChannelNonceCompoundUniqueInput.schema';
import { IntegrationIngressReceiptChannelEventIdCompoundUniqueInputObjectSchema as IntegrationIngressReceiptChannelEventIdCompoundUniqueInputObjectSchema } from './IntegrationIngressReceiptChannelEventIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  channel_nonce: z.lazy(() => IntegrationIngressReceiptChannelNonceCompoundUniqueInputObjectSchema).optional(),
  channel_eventId: z.lazy(() => IntegrationIngressReceiptChannelEventIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const IntegrationIngressReceiptWhereUniqueInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptWhereUniqueInput>;
export const IntegrationIngressReceiptWhereUniqueInputObjectZodSchema = makeSchema();
