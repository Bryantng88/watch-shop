import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  channel: z.string(),
  externalRequestId: z.string()
}).strict();
export const PurchaseRequestChannelExternalRequestIdCompoundUniqueInputObjectSchema: z.ZodType<Prisma.PurchaseRequestChannelExternalRequestIdCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestChannelExternalRequestIdCompoundUniqueInput>;
export const PurchaseRequestChannelExternalRequestIdCompoundUniqueInputObjectZodSchema = makeSchema();
