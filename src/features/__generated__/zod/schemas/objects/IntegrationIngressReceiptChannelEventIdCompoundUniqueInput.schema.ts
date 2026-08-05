import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  channel: z.string(),
  eventId: z.string()
}).strict();
export const IntegrationIngressReceiptChannelEventIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.IntegrationIngressReceiptChannelEventIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.IntegrationIngressReceiptChannelEventIdCompoundUniqueInput>;
export const IntegrationIngressReceiptChannelEventIdCompoundUniqueInputObjectZodSchema = makeSchema();
