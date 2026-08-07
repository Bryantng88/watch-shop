import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestChannelExternalRequestIdCompoundUniqueInputObjectSchema as PurchaseRequestChannelExternalRequestIdCompoundUniqueInputObjectSchema } from './PurchaseRequestChannelExternalRequestIdCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  reference: z.string().optional(),
  requestKey: z.string().optional(),
  orderId: z.string().optional(),
  channel_externalRequestId: z.lazy(() => PurchaseRequestChannelExternalRequestIdCompoundUniqueInputObjectSchema).optional()
}).strict();
export const PurchaseRequestWhereUniqueInputObjectSchema: z.ZodType<Prisma.PurchaseRequestWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestWhereUniqueInput>;
export const PurchaseRequestWhereUniqueInputObjectZodSchema = makeSchema();
